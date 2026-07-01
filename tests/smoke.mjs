// Offline smoke test for the Stitch Milton Keynes site.
//
// Loads index.html in a real (headless) browser and checks that it renders
// without errors, the 3D studio resolves (renders or shows its WebGL fallback),
// the brand patches are injected, and the reveal system reveals content.
//
// three.js is served from the local install (node_modules/three) so the test
// needs no network — the CDN import-map URLs are intercepted and fulfilled
// from disk. Chromium is the pre-installed browser (PLAYWRIGHT_BROWSERS_PATH).
//
//   npm test
//
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const THREE_DIR = path.join(ROOT, "node_modules", "three");
const PREFIX = "/npm/three@0.160.0/";
const mime = (p) => (p.endsWith(".js") ? "text/javascript" : "application/octet-stream");

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

const browser = await chromium.launch({
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-unsafe-swiftshader",
    "--no-sandbox",
  ],
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });

// Serve three.js (and its addons) from the local install → fully offline.
await ctx.route("**://cdn.jsdelivr.net/**", async (route) => {
  try {
    const rel = new URL(route.request().url()).pathname.slice(PREFIX.length);
    route.fulfill({
      status: 200,
      headers: { "content-type": mime(rel), "access-control-allow-origin": "*" },
      body: await readFile(path.join(THREE_DIR, rel)),
    });
  } catch (e) {
    route.fulfill({ status: 404, body: String(e) });
  }
});
// Fonts are non-essential for the test; stub them so offline runs are quiet.
await ctx.route("**://fonts.googleapis.com/**", (r) =>
  r.fulfill({ status: 200, headers: { "content-type": "text/css" }, body: "" }));
await ctx.route("**://fonts.gstatic.com/**", (r) => r.fulfill({ status: 200, body: "" }));

const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + (e.stack || e.message)));
page.on("console", (m) => { if (m.type() === "error") errors.push("console.error: " + m.text()); });

await page.goto("file://" + path.join(ROOT, "index.html"), { waitUntil: "load" });

// Wait for the studio to resolve one way or the other.
await page.waitForFunction(() => {
  const l = document.getElementById("studioLoader");
  const f = document.getElementById("studioFallback");
  return (l && l.classList.contains("hide")) || (f && f.classList.contains("show"));
}, { timeout: 25000 });

const state = await page.evaluate(() => ({
  studio: document.getElementById("studioFallback").classList.contains("show")
    ? "fallback"
    : (document.querySelector("#stage3d canvas") ? "rendered" : "no-canvas"),
  brandPatches: document.querySelectorAll("#brandGrid .flip").length,
  revealsShown: document.querySelectorAll(".reveal.in").length,
  title: document.title,
}));

check(errors.length === 0, "Console/page errors:\n    " + errors.join("\n    "));
check(state.studio === "rendered" || state.studio === "fallback",
  "3D studio did not resolve (got: " + state.studio + ")");
check(state.brandPatches === 6, "Expected 6 brand patches, got " + state.brandPatches);
check(state.revealsShown > 0, "No reveal elements were revealed");
check(/Stitch Milton Keynes/.test(state.title), "Unexpected document title: " + state.title);

await browser.close();

if (failures.length) {
  console.error("SMOKE TEST FAILED:\n  - " + failures.join("\n  - "));
  process.exit(1);
}
console.log(
  `SMOKE TEST PASSED — studio: ${state.studio}, brand patches: ${state.brandPatches}, reveals shown: ${state.revealsShown}`
);
