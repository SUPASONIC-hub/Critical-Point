export function createGameEvent(type, payload = {}) {
  return { type, ...payload, at: payload.at ?? new Date().toISOString() };
}

export function reduceInvestigationState(state = {}, event = {}) {
  if (!event.type || !event.id) return state;
  if (event.type === "INVESTIGATE") {
    return { ...state, [event.id]: { status: "investigated", result: event.result ?? "", at: event.at ?? "" } };
  }
  if (event.type === "HYPOTHESIS_ACTION") {
    return { ...state, [event.id]: { status: event.action ?? "reviewed", at: event.at ?? "" } };
  }
  return state;
}
