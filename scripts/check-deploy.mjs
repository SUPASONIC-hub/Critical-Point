const rawUrl = process.env.DEPLOY_URL;

if (!rawUrl) {
  console.error("DEPLOY_URL is required, for example https://critical-point.onrender.com");
  process.exit(1);
}

let url;
try {
  url = new URL(rawUrl);
} catch {
  console.error(`Invalid DEPLOY_URL: ${rawUrl}`);
  process.exit(1);
}

if (url.protocol !== "https:") {
  console.error("DEPLOY_URL must use https");
  process.exit(1);
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15_000);

try {
  const response = await fetch(url, {
    redirect: "error",
    signal: controller.signal,
    headers: { Accept: "text/html" },
  });
  const body = await response.text();

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!body.includes("<title>") || !body.includes("/assets/")) {
    throw new Error("response does not look like the built app");
  }

  const requiredHeaders = ["x-content-type-options", "referrer-policy", "content-security-policy"];
  const missingHeaders = requiredHeaders.filter((name) => !response.headers.get(name));
  if (missingHeaders.length) {
    throw new Error(`missing security headers: ${missingHeaders.join(", ")}`);
  }

  console.log(`Deployment smoke check passed: ${url.origin}`);
} catch (error) {
  console.error(`Deployment smoke check failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
} finally {
  clearTimeout(timeout);
}
