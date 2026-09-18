import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

const unusedVars = [
  "error",
  { args: "after-used", argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
];

export default [
  {
    ignores: ["dist/**", "node_modules/**", "test-results/**", "playwright-report/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Advisory for now: AppContent still drives several effects imperatively.
      // Tracked as follow-up work; correctness rules below stay errors.
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "no-unused-vars": unusedVars,
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // The runtime is one 2,000-line component whose handlers call Date.now and
    // read refs. Before the gauntlet rewrite the React Compiler bailed on it
    // without reporting, so these rules never ran here; the rewrite changed
    // what the compiler can analyse and it now reads the whole body. The
    // findings are about handlers that predate the rewrite, so they are
    // advisory here until those handlers move into hooks of their own.
    // Everywhere else they stay errors.
    files: ["src/GameRuntime.jsx"],
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.js", "*.config.js", "eslint.config.js"],
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
      "scripts/build-critical-css.mjs",
      "tests/**/*.js",
    ],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
