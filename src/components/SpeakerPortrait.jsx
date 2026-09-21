/**
 * Who is speaking, as a face or as a drawn silhouette.
 *
 * Five of the season's speakers have painted portraits. The other seven --
 * everyone the second act brought in, and the two people in the 국정감사 case --
 * all fell back to one generic photo, so the briefing page put the same stranger
 * behind 나준혁, 권도현, 서하린 and 차지원 alike. A face that belongs to nobody
 * reads as a mistake; a drawn silhouette reads as a character not yet painted.
 *
 * So a speaker without a portrait is drawn: a head-and-shoulders silhouette on
 * a halftone ground, tinted from the name so every character keeps one colour
 * across the season, with their initial in the corner. It is `alt=""` /
 * `aria-hidden` either way -- the name is printed right beside it.
 */
const TINTS = ["--c-sky", "--c-amber", "--c-coral", "--c-sage", "--c-violet", "--c-danger-81", "--c-sky-86", "--c-acid-72"];

function tintOf(name = "") {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return TINTS[hash % TINTS.length];
}

export function SpeakerPortrait({ name = "", src = null, size, className = "" }) {
  if (src) {
    return <img className={className} src={src} alt="" width={size} height={size} loading="lazy" decoding="async" />;
  }
  const tint = `var(${tintOf(name)})`;
  const id = `portrait-${tintOf(name).slice(4)}-${size}`;
  return (
    <svg className={className} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.3" fill={tint} opacity="0.45" />
        </pattern>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.7" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="var(--ui-surface-2)" />
      <rect width="100" height="100" fill={`url(#${id}-light)`} />
      <rect width="100" height="100" fill={`url(#${id}-dots)`} />
      {/* Head and shoulders, back-lit: a rim of the character's colour. */}
      <g fill="var(--ui-bg)" stroke={tint} strokeWidth="2">
        <path d="M14 100 C16 76 32 66 50 66 C68 66 84 76 86 100 Z" />
        <ellipse cx="50" cy="44" rx="17" ry="20" />
      </g>
      <text x="90" y="20" textAnchor="end" fontSize="18" fontWeight="900" fill={tint}>
        {name.slice(0, 1)}
      </text>
    </svg>
  );
}
