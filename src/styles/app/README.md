CSS is split by app surface and imported in order from `src/styles/app.css`.

- `base-intro-ranking.css`: global shell, error screen, intro, and ranking surfaces.
- `play.css`: main play screen and scene interaction styles.
- `result.css`: result, ending, and report styles.
- `recovery.css`: recovery notice, error log, and save slot panels.
- `extensions.css`: later feature surfaces and responsive overrides that depend on earlier rules.

Keep overrides after the files they depend on. If a selector applies to multiple screens,
prefer the earliest file that owns the shared surface.
