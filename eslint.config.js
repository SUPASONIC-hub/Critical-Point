import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

const unusedVars = [
  "error",
  { args: "after-used", argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
];

export default [
  {
    // app/: the store shells' own packages, the web build they carry and
    // the native projects (docs/app-shell.md); its scripts are linted below.
    ignores: [".claude/**", "dist/**", "node_modules/**", "test-results/**", "playwright-report/**", "coverage/**", "app/node_modules/**", "app/dist-app/**", "app/ios/**", "app/twa/**/build/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      // __CP_DEBUG_BUILD__ and __CP_SERVICE_WORKER__ are written by the bundler
      // (vite.config.js `define`).
      globals: { ...globals.browser, __CP_DEBUG_BUILD__: "readonly", __CP_SERVICE_WORKER__: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // An error like the rest. It was "warn" (and set-state-in-effect with
      // it) for the effects AppContent drove imperatively, but `npm run lint`
      // runs with --max-warnings 0, so a warning already failed the run and the
      // level only said otherwise. What is left is seven lines that switch
      // the rule off for the line after them, each with its reason beside it:
      // GameRuntime.jsx (1), GauntletStage.jsx (4), GauntletFx.jsx (1),
      // useDialogFocus.js (1). (The directive is not spelled out here: a
      // comment line that starts with it is read as one.)
      "react-hooks/exhaustive-deps": "error",
      "no-unused-vars": unusedVars,
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // tests/unit/*.test.mjs matched neither pattern until 2026-09-28, so it was
    // linted with no Node globals and the default unused-vars options.
    files: ["scripts/**/*.mjs", "tests/**/*.{js,mjs}", "*.config.js", "eslint.config.js", "app/*.mjs", "app/twa/*.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: { "no-unused-vars": unusedVars },
  },
  {
    // These run node code that also evaluates in a page, so both sets of
    // globals are legitimate in one file.
    files: [
      "scripts/runtime-smoke.mjs",
      "scripts/build-art-variants.mjs",
      "scripts/build-portrait.mjs",
      "scripts/build-critical-css.mjs",
      "tests/**/*.{js,mjs}",
    ],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
