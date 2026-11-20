import { useEffect, useState } from "react";
import { NOTES_INDEX_PATH, READING_EYEBROW, readingMenu } from "../homeReading.js";
import { NEWS_INDEX_PATH, NEWS_PAPER } from "../news/newsPaper.js";

/**
 * 오늘의 1면 for today in Seoul (src/news/newsIndex.js `todayFrontPage`), or null
 * until its chunk arrives: the thirty articles stay out of the first paint, and
 * the section is under the first screen. A chunk that fails leaves the paper's link.
 */
function useTodayFront() {
  const [front, setFront] = useState(null);
  useEffect(() => {
    let live = true;
    import("../news/newsIndex.js")
      .then((news) => live && setFront(news.todayFrontPage()))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return front;
}

/**
 * 읽을거리: the section under the start screen that a reader can read (src/homeReading.js
 * says why). `copy` is the intro's `reading`, `legal` its `legal`, `notes` the newest notes
 * the build wrote pages for (__CP_RECENT_NOTES__, vite.config.js; src/notes/noteIndex.js `recentNotes`),
 * and 오늘의 1면, the world newspaper's article for today in Seoul (`useTodayFront`).
 */
export function HomeReading({ copy, legal, language, notes }) {
  const front = useTodayFront();
  const menu = readingMenu(copy, legal, language);
  return (
    <section className="home-reading" aria-labelledby="home-reading-title">
      <div className="home-reading-head">
        <span className="home-reading-eyebrow" lang="en">{READING_EYEBROW}</span>
        <h2 id="home-reading-title">{copy.title}</h2>
      </div>
      <div className="home-reading-about">
        {copy.intro.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <nav className="home-reading-menu" aria-label={copy.menuLabel}>
        <h3>{copy.menuTitle}</h3>
        <ul>
          {menu.map((row) => (
            <li key={row.kind} data-kind={row.kind}>
              <span className="home-reading-links">
                {row.links.map((link) => (
                  <a key={link.href} href={link.href} hrefLang={link.hreflang ?? undefined}>
                    {link.label}
                  </a>
                ))}
              </span>
              <small>{row.text}</small>
            </li>
          ))}
        </ul>
      </nav>
      <div className="home-reading-press">
        <div className="home-reading-front">
          <h3>{copy.frontTitle}</h3>
          {front ? (
            <div className="home-reading-story" lang="ko">
              <p className="home-reading-paper">
                {NEWS_PAPER} · {front.section} · <time dateTime={front.day}>{front.date}</time>
              </p>
              <a href={front.href}>{front.title}</a>
              <p>{front.summary}</p>
            </div>
          ) : null}
          <p className="home-reading-fiction">{copy.frontNote}</p>
          <a className="home-reading-all" href={NEWS_INDEX_PATH} hrefLang={language === "ko" ? undefined : "ko"}>
            {copy.frontAll}
          </a>
        </div>
        <div className="home-reading-notes">
          <h3>{copy.notesTitle}</h3>
          {notes.length ? (
            <ul lang="ko">
              {notes.map((note) => (
                <li key={note.href}>
                  <a href={note.href}>{note.title}</a>
                  <time dateTime={note.day}>{note.date}</time>
                  <p>{note.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>{copy.notesEmpty}</p>
          )}
          <a className="home-reading-all" href={NOTES_INDEX_PATH} hrefLang={language === "ko" ? undefined : "ko"}>
            {copy.notesAll}
          </a>
        </div>
      </div>
    </section>
  );
}
