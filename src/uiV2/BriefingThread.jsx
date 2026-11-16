import { useState } from "react";
import { FileText } from "lucide-react";
import briefingCopy from "../copy/briefing.js";
import { Prose, ProseCaptions, ProseItems } from "../components/Prose.jsx";
import { ScenePlate } from "../components/ScenePlate.jsx";
import { SpeakerPortrait } from "../components/SpeakerPortrait.jsx";

/**
 * The briefing page as the place it happens (?ui=v2): the speaker writes to
 * you in the office messenger and sends the case file, which opens as a
 * document. The same words as the comic page (SceneBriefing.jsx), in the same
 * order, without the stacked bordered panels: the room as a photo in the
 * thread, the speaker's line as a message, the narration as plain lines
 * between them and the speaker's own speech in it as their messages
 * (ProseCaptions' `data-who`), and the file as an attachment whose document is
 * open until the player folds it.
 *
 * 「당신의 판단」 is not in the thread: it is the question the cards answer,
 * so the page prints it over the hand (SceneBriefing.jsx).
 */
export function BriefingThread({ node, nodeId, portrait, speakerRole, speech, told, bridge, reaction, trace, unfold }) {
  const say = briefingCopy.v2;
  const name = node.speakerName ?? node.speaker;
  const [fileOpen, setFileOpen] = useState(true);
  const hasFile = told.memo?.length > 0 || Boolean(trace);

  return (
    <section className="v2-thread" aria-label={say.thread}>
      {(node.place || node.clock) && (
        <p className="v2-day">
          {node.place && <span>{node.place}</span>}
          {node.clock && <time>{node.clock}</time>}
        </p>
      )}
      {/* Where the last scene left off (D-7). */}
      {bridge && <p className="v2-note" data-testid="scene-bridge">{bridge}</p>}

      <div className="v2-from">
        <SpeakerPortrait className="v2-avatar" name={node.speaker} src={portrait} size={40} />
        <p className="v2-who">
          <b>{name}</b> <span>{speakerRole}</span>
        </p>
      </div>
      {reaction && (
        <p className="v2-msg" data-testid="table-reaction">
          <small>{reaction.recap}</small>
          “{reaction.line}”
        </p>
      )}
      <figure className="v2-photo">
        <ScenePlate node={node} nodeId={nodeId} />
      </figure>
      {speech.line &&
        (speech.fromLead ? (
          <p className="v2-note"><Prose text={speech.line} /></p>
        ) : (
          <blockquote className="v2-msg"><Prose text={speech.line} /></blockquote>
        ))}

      <div className="v2-story">
        {unfold}
        {told.lead && !speech.fromLead && <p className="v2-note"><Prose text={told.lead} /></p>}
        <ProseCaptions text={told.text} who={name} whoAt={speech.whoAt} />
      </div>

      {hasFile && (
        <div className={`v2-file${fileOpen ? " is-open" : ""}`}>
          <button type="button" className="v2-attach" aria-expanded={fileOpen} aria-controls="v2-file-doc" onClick={() => setFileOpen(!fileOpen)}>
            <FileText size={20} aria-hidden="true" />
            <span>
              <small>{say.attachment}</small>
              <b>{briefingCopy.caseFile}</b>
            </span>
            <em>{fileOpen ? say.closeFile : say.openFile}</em>
          </button>
          <article id="v2-file-doc" className="v2-doc" hidden={!fileOpen}>
            <header>
              <span lang="en">CASE FILE</span>
              <b>{node.title}</b>
            </header>
            <ul>
              <ProseItems items={told.memo ?? []} />
              {trace && <li data-testid="scene-trace">{trace}</li>}
            </ul>
          </article>
        </div>
      )}
    </section>
  );
}
