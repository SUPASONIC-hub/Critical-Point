/**
 * LLM enrichment for the free-input card.
 *
 * The regex scorer in `gameLogic.js` stays the authority for everything the
 * card resolves synchronously -- the resource effect, the cognition axes, the
 * three-signal success gate, the branch target. It runs in one pass inside the
 * submit handler and the resource bars have already moved by the time this
 * module is called. A network round trip cannot sit in that path: the betting
 * window is a stopwatch, and a card that pauses for two seconds after the
 * player commits is a card that broke.
 *
 * So this runs after the card is resolved and adds only what can arrive late --
 * the trigger vote, the headquarters line, the ending weight, and two scores
 * that the result screen reads at the end of the run. If it never answers, the
 * entry keeps `llmEnriched: false` and nothing has to be undone.
 */

import { FREE_TEXT_MAX_LENGTH, limitText } from "./appConfig.js";

const viteEnv = import.meta.env ?? {};
const SUPABASE_URL = viteEnv.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = viteEnv.VITE_SUPABASE_ANON_KEY || "";

/** Long enough for a paragraph of Korean, short enough to lose to the next card. */
const ANALYSIS_TIMEOUT_MS = 12000;

/**
 * Off unless asked for. The edge function has no Anthropic key, so every live
 * call would spend a function invocation to be told 503 -- and the reading is
 * done offline instead by `scripts/analyze-free-text-batch.mjs`. Setting
 * `VITE_ENABLE_LIVE_ANALYSIS=true` turns the live path back on the day a key
 * exists; nothing else has to change.
 */
export const analysisEnabled =
  viteEnv.VITE_ENABLE_LIVE_ANALYSIS === "true" && Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const TRIGGER_IDS = ["affection", "revenge", "responsibility", "curiosity"];

/**
 * Only the resources the free-text effect can actually move. `humanCost` is not
 * among them -- `scoreFreeText` never writes it -- so a fracture target naming
 * it would bill 1.5x on a number this card cannot change.
 */
export const FRACTURE_TARGETS = ["time", "capital", "trust", "legitimacy", "fatigue"];

/** The nine the season really has. `advancedSystems.js` holds their scenes. */
export const ENDING_IDS = [
  "open-oversight",
  "evidence-reform",
  "human-record",
  "profitable-silence",
  "cold-justice",
  "field-pact",
  "quiet-cover",
  "collapse",
  "open-question",
];

const SYSTEM_COMMENT_MAX_LENGTH = 40;
const REASON_MAX_LENGTH = 120;

function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, parsed));
}

function pickFrom(value, allowed) {
  return allowed.includes(value) ? value : null;
}

function asObject(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * The model is told to answer with a bare object, and a fence or a sentence in
 * front of it is off-contract. Both are cheap to survive, and refusing them
 * would throw away an otherwise good answer over punctuation. There is no
 * assistant prefill forcing the opening brace -- a prefill returns a 400 on
 * every model above Haiku, so the parser carries this instead of the request.
 */
export function parseAnalysisJson(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const unfenced = text.startsWith("```")
    ? text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
    : text;
  const direct = asObject(unfenced);
  if (direct) return direct;
  // Last resort: the widest brace span in the reply. Anything outside it was
  // preamble the model was asked not to write.
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  return start !== -1 && end > start ? asObject(unfenced.slice(start, end + 1)) : null;
}

/**
 * Every field is checked and every field may be dropped on its own. A model
 * that got the trigger right and the ending wrong should not lose the trigger,
 * and a field that fails validation has to come back absent rather than
 * defaulted -- a defaulted score is indistinguishable from a real one once it
 * reaches the result screen.
 */
export function normalizeAnalysis(payload) {
  if (!payload || typeof payload !== "object") return null;
  const analysis = payload.analysis ?? {};
  const alteration = payload.rule_alteration ?? {};
  const ending = payload.ending_weight ?? {};

  const trigger = pickFrom(analysis.detected_trigger, TRIGGER_IDS);
  const endingId = pickFrom(ending.toward, ENDING_IDS);
  const normalized = {
    reframe: clampNumber(analysis.reframe, 0, 100),
    grounding: clampNumber(analysis.grounding, 0, 100),
    trigger,
    // A trigger with no confidence is a verdict, and the run-level tally has no
    // way to weigh a verdict against the votes around it.
    confidence: trigger ? (clampNumber(analysis.confidence, 0, 1) ?? 0.5) : null,
    triggerReason: limitText(String(analysis.trigger_reason ?? "").trim(), REASON_MAX_LENGTH),
    injectionAttempt: analysis.injection_attempt === true,
    fractureTarget: pickFrom(alteration.fracture_target, FRACTURE_TARGETS),
    systemComment: limitText(String(alteration.system_comment ?? "").trim(), SYSTEM_COMMENT_MAX_LENGTH),
    endingToward: endingId,
    endingDelta: endingId ? (clampNumber(ending.delta, 0, 1) ?? 0) : null,
    endingReason: limitText(String(ending.reason ?? "").trim(), REASON_MAX_LENGTH),
  };

  // An object where every field failed is a parse that happened to be valid
  // JSON. Treating it as a result would mark the entry enriched with nothing in
  // it.
  const hasAnything =
    normalized.reframe !== null ||
    normalized.grounding !== null ||
    normalized.trigger !== null ||
    normalized.fractureTarget !== null ||
    normalized.systemComment !== "";
  return hasAnything ? normalized : null;
}

export function buildAnalysisRequest({
  freeText,
  caseId,
  stageName,
  presentedOptions = [],
  resources = {},
  appliedEffect = {},
}) {
  return {
    player_input: limitText(String(freeText ?? "").trim(), FREE_TEXT_MAX_LENGTH),
    case_id: String(caseId ?? ""),
    stage_name: String(stageName ?? ""),
    presented_options: presentedOptions.map((option) => String(option ?? "")).slice(0, 6),
    current_resources: resources,
    applied_effect: appliedEffect,
  };
}

/**
 * Resolves to a normalized analysis or to null. It never rejects: every caller
 * is a card that has already been played, and there is nothing for a thrown
 * error to abort.
 */
export async function requestFreeTextAnalysis(input, { signal } = {}) {
  if (!analysisEnabled) return null;
  const body = buildAnalysisRequest(input);
  if (!body.player_input) return null;

  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = setTimeout(() => controller?.abort(), ANALYSIS_TIMEOUT_MS);
  const onAbort = () => controller?.abort();
  signal?.addEventListener?.("abort", onAbort);

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-free-text`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return normalizeAnalysis(parseAnalysisJson(payload?.content ?? ""));
  } catch {
    // Offline, aborted, rate-limited, malformed -- the card already resolved
    // and the entry stays as the regex scorer left it.
    return null;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener?.("abort", onAbort);
  }
}
