/**
 * `npm run check:twa` (in app/): the Android TWA's config, before a build.
 *
 * - twa-manifest.json, public/.well-known/assetlinks.json, the iOS shell's
 *   capacitor.config.json and src/platform/appShell.js name one package.
 * - The Android project Bubblewrap wrote from twa-manifest.json, once there is
 *   one (`bubblewrap update`), targets API 36 or higher: Google Play has asked
 *   for Android 16 from new apps and updates since 2026-08-31.
 * - The iOS home screen name is in Korean, English and Japanese: each
 *   <lang>.lproj/InfoPlist.strings, listed in the Xcode project, with its
 *   language in CFBundleLocalizations and knownRegions, says the name the
 *   site's pages already use (GAME_NAME, scripts/legal-pages.mjs). The TWA's
 *   `name` and `launcherName` are one string each in Bubblewrap's format, so
 *   Android shows the Korean name in every language.
 * - assetlinks.json still holding the zero placeholder is a warning here and an
 *   error with `--release`: without the real certificate fingerprint Chrome
 *   cannot verify the site and opens it with a URL bar (docs/app-shell.md).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GAME_NAME } from "../../scripts/legal-pages.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, "..");
const root = path.resolve(app, "..");
const release = process.argv.includes("--release");
const MIN_TARGET_SDK = 36;
const PLACEHOLDER = /^(00:){31}00$/;

const problems = [];
const warnings = [];
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));

const twa = readJson(path.join(here, "twa-manifest.json"));
const capacitor = readJson(path.join(app, "capacitor.config.json"));
const links = readJson(path.join(root, "public", ".well-known", "assetlinks.json"));
const shellSource = readFileSync(path.join(root, "src", "platform", "appShell.js"), "utf8");
const shellPackage = /APP_PACKAGE_ID = "([^"]+)"/.exec(shellSource)?.[1];

const target = links.find((link) => link.target?.namespace === "android_app")?.target;
const named = {
  "twa-manifest.json packageId": twa.packageId,
  "capacitor.config.json appId": capacitor.appId,
  "assetlinks.json package_name": target?.package_name,
  "appShell.js APP_PACKAGE_ID": shellPackage,
};
if (new Set(Object.values(named)).size !== 1) {
  problems.push(`The package is named differently: ${Object.entries(named).map(([where, value]) => `${where} = ${value}`).join(", ")}.`);
}
if (`https://${twa.host}/` !== twa.fullScopeUrl) problems.push(`twa-manifest.json fullScopeUrl ${twa.fullScopeUrl} is not the host ${twa.host}.`);

// The short name, as the Korean one is the part before the colon (public/manifest.webmanifest short_name).
const iosDir = path.join(app, "ios", "App");
const plist = readFileSync(path.join(iosDir, "App", "Info.plist"), "utf8");
const pbxproj = readFileSync(path.join(iosDir, "App.xcodeproj", "project.pbxproj"), "utf8");
const regions = /knownRegions = \(([^)]*)\)/.exec(pbxproj)?.[1] ?? "";
const localizations = /<key>CFBundleLocalizations<\/key>\s*<array>([\s\S]*?)<\/array>/.exec(plist)?.[1] ?? "";
for (const language of ["ko", "en", "ja"]) {
  const name = GAME_NAME[language].split(":")[0];
  const file = path.join(iosDir, "App", `${language}.lproj`, "InfoPlist.strings");
  const strings = existsSync(file) ? readFileSync(file, "utf8") : "";
  for (const key of ["CFBundleDisplayName", "CFBundleName"]) {
    if (!strings.includes(`"${key}" = "${name}";`)) problems.push(`ios/App/App/${language}.lproj/InfoPlist.strings does not name the app "${name}" (${key}).`);
  }
  if (!pbxproj.includes(`path = ${language}.lproj/InfoPlist.strings;`)) problems.push(`The Xcode project does not list ${language}.lproj/InfoPlist.strings.`);
  if (!regions.split(/[\s,]+/).includes(language)) problems.push(`The Xcode project's knownRegions has no ${language}.`);
  if (!localizations.includes(`<string>${language}</string>`)) problems.push(`Info.plist CFBundleLocalizations has no ${language}.`);
}

const fingerprints = target?.sha256_cert_fingerprints ?? [];
if (!fingerprints.length) problems.push("assetlinks.json names no certificate fingerprint.");
for (const fingerprint of fingerprints) {
  if (!/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/i.test(fingerprint)) problems.push(`assetlinks.json fingerprint ${fingerprint} is not a SHA-256 in AA:BB:... form.`);
  else if (PLACEHOLDER.test(fingerprint)) (release ? problems : warnings).push("assetlinks.json still holds the zero placeholder fingerprint: put the Play app signing key's SHA-256 (and the upload key's) there.");
}

const gradle = path.join(here, "app", "build.gradle");
if (existsSync(gradle)) {
  const text = readFileSync(gradle, "utf8");
  for (const key of ["compileSdkVersion", "targetSdkVersion"]) {
    const value = Number(new RegExp(`${key}\\s+(\\d+)`).exec(text)?.[1]);
    if (!(value >= MIN_TARGET_SDK)) problems.push(`app/twa/app/build.gradle ${key} is ${value || "missing"}; Google Play needs ${MIN_TARGET_SDK} or higher.`);
  }
} else {
  (release ? problems : warnings).push("No Android project yet (app/twa/app/build.gradle): run `npx @bubblewrap/cli@1.27.0 update` in app/twa first.");
}

for (const line of warnings) console.warn(`warning: ${line}`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`TWA config agrees: ${twa.packageId} on ${twa.host}${release ? ", ready to sign" : ""}.`);
}
