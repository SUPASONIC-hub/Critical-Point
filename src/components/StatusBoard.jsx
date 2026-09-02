
export function StatusBoard({
  playerName,
  activePlayStyle,
  turnBriefItems,
  sceneChallenge,
  resourceMeta,
  resources,
  node,
  speakerProfile,
  triggerLabels,
  progress,
  log,
  completedCases,
  activeCaseMeta,
}) {
  return (
      <aside className="status-board">
        <div className="analyst-card">
          <span>분석관</span>
          <strong>{playerName}</strong>
          <small>{activePlayStyle.label} · {activePlayStyle.title}</small>
        </div>
        <section className="turn-brief">
          <h2>이번 턴 브리프</h2>
          <div>
            {turnBriefItems.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
              </article>
            ))}
          </div>
          <p>{sceneChallenge.text}</p>
        </section>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>상황판</span>
            <b>자원 상세 보기</b>
          </summary>
          <div className="resource-list">
            {Object.entries(resourceMeta).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div className="resource" key={key}>
                  <div>
                    <Icon size={16} />
                    <span>{meta.label}</span>
                  </div>
                  <b>
                    {resources[key]}
                    {meta.suffix}
                  </b>
                </div>
              );
            })}
          </div>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>발언자</span>
            <b>맥락 보기</b>
          </summary>
          <div className="speaker-card">
            <strong>{node.speaker}</strong>
            <span>{speakerProfile.role}</span>
            <p>{speakerProfile.stance}</p>
          </div>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>현재 트리거</span>
            <b>{node.triggers.length}개 활성</b>
          </summary>
          <div className="trigger-tags">
            {node.triggers.map((trigger) => (
              <span key={trigger}>{triggerLabels[trigger]}</span>
            ))}
          </div>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>진행률</span>
            <b>{progress}%</b>
          </summary>
          <div className="mini-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p className="status-note">{progress}% · {log.length}개 선택 기록됨</p>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>시즌 아크</span>
            <b>사건 배경</b>
          </summary>
          <p className="status-note">
            {activeCaseMeta?.label}은 {activeCaseMeta?.summary}
          </p>
          <p className="status-note">
            완료 {completedCases.length}개 케이스와 현재 로그 {log.length}개가 다음 사건의 압박
            조건으로 누적됩니다.
          </p>
        </details>
      </aside>
  );
}
