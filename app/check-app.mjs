/**
 * `npm run check:app` (in app/): the two Capacitor shells' settings, before a
 * build (docs/app-shell.md). It reads files only, so it runs where neither
 * the Android SDK nor Xcode is installed, and tests/unit/app-shell.test.mjs
 * runs it with every `npm test`. It took over from `check:twa` when Android
 * became Capacitor on 2026-10-25 (the user's decision 4).
 *
 * - One package: capacitor.config.json, the Android project (namespace,
 *   applicationId, package_name), the Xcode project's bundle identifier and
 *   src/platform/appShell.js name com.taknroll.criticalpoint.
 * - Android targets and compiles against API 36 or higher: Google Play has
 *   asked for Android 16 from new apps and updates since 2026-08-31. minSdk
 *   is Capacitor 8's 24.
 * - AdMob: each platform has an app ID in the native settings (Android's
 *   manifest meta-data, iOS's GADApplicationIdentifier), iOS has the tracking
 *   question in Korean and English and Google's SKAdNetwork ID.
 * - The plugins are pinned to exact versions, and the product is remove_ads.
 * - Google's test IDs and the zero placeholders in native/adUnits.js are a
 *   warning here and an error with `--release`: a store build must carry the
 *   live IDs (and a development build never does, memo B-1 (6)).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(app, "..");
const release = process.argv.includes("--release");
const MIN_SDK = 24;
const MIN_TARGET_SDK = 36;
const GOOGLE_TEST_PUBLISHER = "ca-app-pub-3940256099942544";
const APP_ID = /^ca-app-pub-\d{16}~\d{10}$/;

const problems = [];
const warnings = [];
const read = (...parts) => readFileSync(path.join(app, ...parts), "utf8");
const needs = (condition, problem) => condition || problems.push(problem);
const testOrPlaceholder = (where, id) => {
  if (id.startsWith(GOOGLE_TEST_PUBLISHER) || /ca-app-pub-0{16}/.test(id)) {
    (release ? problems : warnings).push(`${where} still holds a test or placeholder AdMob ID (${id}).`);
  }
};

// One package.
const capacitor = JSON.parse(read("capacitor.config.json"));
const gradle = read("android", "app", "build.gradle");
const strings = read("android", "app", "src", "main", "res", "values", "strings.xml");
const pbxproj = read("ios", "App", "App.xcodeproj", "project.pbxproj");
const shellSource = readFileSync(path.join(root, "src", "platform", "appShell.js"), "utf8");
const bundleIds = [...pbxproj.matchAll(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/g)].map((match) => match[1]);
const named = {
  "capacitor.config.json appId": capacitor.appId,
  "android/app/build.gradle namespace": /namespace\s*=?\s*"([^"]+)"/.exec(gradle)?.[1],
  "android/app/build.gradle applicationId": /applicationId\s+"([^"]+)"/.exec(gradle)?.[1],
  "strings.xml package_name": /<string name="package_name">([^<]+)<\/string>/.exec(strings)?.[1],
  "project.pbxproj PRODUCT_BUNDLE_IDENTIFIER": bundleIds.length && new Set(bundleIds).size === 1 ? bundleIds[0] : bundleIds.join(" / ") || undefined,
  "appShell.js APP_PACKAGE_ID": /APP_PACKAGE_ID = "([^"]+)"/.exec(shellSource)?.[1],
};
needs(
  new Set(Object.values(named)).size === 1,
  `The package is named differently: ${Object.entries(named).map(([where, value]) => `${where} = ${value}`).join(", ")}.`,
);

// Android API levels.
const variables = read("android", "variables.gradle");
const level = (key) => Number(new RegExp(`${key}\\s*=\\s*(\\d+)`).exec(variables)?.[1]);
for (const key of ["compileSdkVersion", "targetSdkVersion"]) {
  needs(level(key) >= MIN_TARGET_SDK, `android/variables.gradle ${key} is ${level(key) || "missing"}; Google Play needs ${MIN_TARGET_SDK} or higher.`);
}
needs(level("minSdkVersion") >= MIN_SDK, `android/variables.gradle minSdkVersion is ${level("minSdkVersion") || "missing"}; Capacitor 8 needs ${MIN_SDK}.`);

// AdMob, Android.
const manifest = read("android", "app", "src", "main", "AndroidManifest.xml");
needs(
  /android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"\s+android:value="@string\/admob_app_id"/.test(manifest),
  "AndroidManifest.xml has no com.google.android.gms.ads.APPLICATION_ID meta-data pointing at @string/admob_app_id.",
);
const androidAppId = /<string name="admob_app_id"[^>]*>([^<]+)<\/string>/.exec(strings)?.[1] ?? "";
needs(APP_ID.test(androidAppId), `strings.xml admob_app_id "${androidAppId}" is not an AdMob app ID (ca-app-pub-…~…).`);
if (androidAppId) testOrPlaceholder("strings.xml admob_app_id", androidAppId);

// AdMob, iOS.
const plist = read("ios", "App", "App", "Info.plist");
const plistString = (key) => new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`).exec(plist)?.[1] ?? "";
const iosAppId = plistString("GADApplicationIdentifier");
needs(APP_ID.test(iosAppId), `Info.plist GADApplicationIdentifier "${iosAppId}" is not an AdMob app ID (ca-app-pub-…~…).`);
if (iosAppId) testOrPlaceholder("Info.plist GADApplicationIdentifier", iosAppId);
needs(plist.includes("<string>cstr6suwn9.skadnetwork</string>"), "Info.plist SKAdNetworkItems lacks Google's cstr6suwn9.skadnetwork.");
needs(plistString("NSUserTrackingUsageDescription").length > 0, "Info.plist has no NSUserTrackingUsageDescription (the ATT question).");
for (const language of ["ko", "en"]) {
  const file = path.join(app, "ios", "App", "App", `${language}.lproj`, "InfoPlist.strings");
  needs(existsSync(file) && /"NSUserTrackingUsageDescription" = ".+";/.test(readFileSync(file, "utf8")), `ios/App/App/${language}.lproj/InfoPlist.strings has no NSUserTrackingUsageDescription.`);
  needs(pbxproj.includes(`path = ${language}.lproj/InfoPlist.strings;`), `The Xcode project does not list ${language}.lproj/InfoPlist.strings.`);
}

// The ad units the page asks for.
const units = read("native", "adUnits.js");
const liveBlock = /export const LIVE_UNITS = [\s\S]*?\n\}\);/.exec(units)?.[0] ?? "";
for (const id of liveBlock.match(/ca-app-pub-[\d/~]+/g) ?? []) testOrPlaceholder("native/adUnits.js LIVE_UNITS", id);

// Plugins pinned, product named.
const manifestJson = JSON.parse(read("package.json"));
for (const [name, version] of Object.entries({ ...manifestJson.dependencies, ...manifestJson.devDependencies })) {
  needs(/^\d+\.\d+\.\d+$/.test(version), `app/package.json ${name} is "${version}"; pin an exact version.`);
}
needs(/export const REMOVE_ADS = "remove_ads";/.test(read("native", "store.js")), "native/store.js does not sell remove_ads (memo C-1).");

for (const line of new Set(warnings)) console.warn(`warning: ${line}`);
if (problems.length) {
  console.error([...new Set(problems)].join("\n"));
  process.exitCode = 1;
} else {
  console.log(`App shells agree: ${capacitor.appId}, Android API ${level("targetSdkVersion")} (min ${level("minSdkVersion")}), AdMob and remove_ads set${release ? ", ready to sign" : ""}.`);
}
