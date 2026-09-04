import { Check, Send, Sparkles } from "lucide-react";

import { FREE_TEXT_SIGNAL_MIN_LENGTH } from "../gameLogic.js";
import { GuardedButton } from "./GuardedButton.jsx";

export function FreeTextReframeBox({
  activeFreeTextSignalCount,
  activePrivacySignals,
  anonymizeFreeText,
  applyEffect,
  boardChangePrompts,
  choose,
  cognitionLabels,
  easyCognitionLabels,
  explainResourceTradeoff,
  freeChoice,
  freeText,
  FREE_TEXT_MAX_LENGTH,
  freeTextBlockedByPrivacy,
  freeTextPreview,
  getRiskPressure,
  isAdvancing,
  lastFreeTextSignals,
  resourceMeta,
  resources,
  riskPressure,
  sceneChallenge,
  updateFreeText,
}) {
  if (!freeChoice) return null;

  return (
    <div className="reframe-box">
      <div className="panel-title-row">
        <h2>
          <Sparkles size={17} />
          구조 재설계
        </h2>
        <span>기존 선택지 대신 이해관계자, 조건, 순서를 새로 짠다</span>
      </div>
      <div className="prompt-chips">
        {boardChangePrompts.map((prompt) => (
          <button type="button" key={prompt} onClick={() => updateFreeText(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      <textarea
        value={freeText}
        onChange={(event) => updateFreeText(event.target.value)}
        maxLength={FREE_TEXT_MAX_LENGTH}
        placeholder="예: 누구를 새로 협상장에 부를지, 어떤 조건을 교환할지, 어떤 정보를 먼저 확인할지 적는다."
        aria-label="구조 재설계 자유입력"
        aria-describedby={freeTextBlockedByPrivacy ? "reframe-input-note reframe-privacy-warning" : "reframe-input-note"}
      />
      <p className="input-note" id="reframe-input-note">
        자유입력은 로그에 남을 수 있습니다. 실제 개인정보나 식별 가능한 회사명은 쓰지 마세요.{" "}
        {freeText.length}/{FREE_TEXT_MAX_LENGTH}
      </p>
      {activePrivacySignals.length > 0 && (
        <div className="privacy-warning" id="reframe-privacy-warning" role="alert">
          <strong>식별 정보로 보일 수 있는 표현이 있습니다.</strong>
          <p>
            감지 항목: {activePrivacySignals.map((signal) => signal.label).join(" / ")}.
            제출하려면 실제 이름, 연락처, 회사명을 가상의 역할명이나 익명 표현으로 바꿔주세요.
          </p>
          <button type="button" onClick={anonymizeFreeText}>
            감지 표현 익명화
          </button>
        </div>
      )}
      {freeText.trim() && (
        <div className="reframe-speech">
          <span>발화 예고</span>
          <p>"{freeText.trim()}"</p>
          <small>준비된 선택지 밖으로 나가면, 이 문장이 그대로 장면 로그와 에코의 반론에 남습니다.</small>
        </div>
      )}
      <div className="reframe-signals">
        <div>
          <span>반영 기준</span>
          <b>{activeFreeTextSignalCount}/4</b>
        </div>
        {sceneChallenge.id === "use-reframe" && activeFreeTextSignalCount >= 2 && (
          <strong className="reframe-challenge-hit">챌린지 달성 가능</strong>
        )}
        <p className="reframe-requirement">
          최소 {FREE_TEXT_SIGNAL_MIN_LENGTH}자, 한 문장 이상으로 써야 반영 기준이 잡힙니다.
          두 개 이상 채워지면 선택지 밖의 제안이 단순 의견이 아니라 판을 바꾸는 계획으로 기록됩니다.
        </p>
        {lastFreeTextSignals && (
          <ul className="reframe-signal-feedback">
            {lastFreeTextSignals.map((signal) => (
              <li className={signal.active ? "active" : ""} key={signal.id}>
                <Check size={14} />
                <span>
                  <b>{signal.label}</b>
                  <small>{signal.active ? "직전 문장에서 확인됨" : signal.hint}</small>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {freeTextPreview && (
        <div className="reframe-preview">
          <span>예상 반영</span>
          <p>{explainResourceTradeoff(freeTextPreview.effect)}</p>
          <FreeTextRiskPreview
            applyEffect={applyEffect}
            effect={freeTextPreview.effect}
            getRiskPressure={getRiskPressure}
            resources={resources}
            riskPressure={riskPressure}
          />
          <div>
            {Object.entries(freeTextPreview.effect).map(([key, value]) => (
              <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                {value}
              </small>
            ))}
          </div>
          <div>
            {Object.entries(freeTextPreview.cognition)
              .filter(([, value]) => value > 0)
              .map(([key, value]) => (
                <small key={key} className="cognition-preview">
                  {easyCognitionLabels[key] ?? cognitionLabels[key] ?? key} +{value}
                </small>
              ))}
          </div>
        </div>
      )}
      <GuardedButton
        type="button"
        className="choice free-choice submit-reframe"
        onClick={() => choose(freeChoice)}
        blocked={!freeText.trim() || freeTextBlockedByPrivacy || isAdvancing}
        aria-label={
          freeTextBlockedByPrivacy
            ? "식별 정보로 보일 수 있는 표현을 익명화해야 구조 재설계를 제출할 수 있습니다."
            : freeText.trim()
              ? `구조 재설계 제출. ${freeText.trim()}`
              : "구조 재설계 내용을 입력해야 제출할 수 있습니다."
        }
      >
        <span className="choice-main">
          <Send size={16} />
          {freeChoice.label}
        </span>
      </GuardedButton>
    </div>
  );
}

function FreeTextRiskPreview({ applyEffect, effect, getRiskPressure, resources, riskPressure }) {
  const projectedRisk = getRiskPressure(applyEffect(resources, effect));
  const riskDelta = projectedRisk - riskPressure;
  const riskClass = riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
  const riskLabel = riskDelta > 0 ? `위험 +${riskDelta}` : riskDelta < 0 ? `위험 ${riskDelta}` : "위험 유지";
  return (
    <div>
      <small className={`preview-risk ${riskClass}`}>
        {riskLabel} · 예상 압력 {projectedRisk}
      </small>
    </div>
  );
}
