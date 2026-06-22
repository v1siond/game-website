// ─────────────────────────────────────────────────────────────
// SHOWCASE video fixture — high-quality 4K capture for the master showcase.
//
// Separate from video.js so the normal record:tour path stays exactly 1080p with
// its existing behavior. This fixture:
//   · renders the app at 1920x1080 @ deviceScaleFactor 2 (crisp text),
//   · captures the recording at native 3840x2160 (4K),
//   · injects the showcase CURSOR OVERLAY so the mouse + clicks are visible,
//   · on teardown transcodes the .webm → 3840x2160 H.264 ~60fps high-bitrate .mp4.
//
// 4K headless recording is heavy. Set SHOWCASE_RES=1440 to capture/encode at
// 2560x1440 instead (still high quality) if 4K is too slow/flaky on the host.
//
// Output name comes from test.use({ recordingName }); the master showcase points
// it at "master-walkthrough" so it OVERWRITES recordings/demo-master-walkthrough.mp4.
// ─────────────────────────────────────────────────────────────
import { test as base, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { CURSOR_OVERLAY_SCRIPT } from "./showcase.js";

const RECORDINGS_DIR = path.resolve(process.cwd(), "recordings");

// Final encode resolution. Default 4K; SHOWCASE_RES=1440 falls back to 2560x1440.
const RES = process.env.SHOWCASE_RES === "1440"
  ? { w: 2560, h: 1440 }
  : { w: 3840, h: 2160 };

export const SHOWCASE_RES = RES;

// IMPORTANT — how Playwright captures: recordVideo captures the page at its CSS-pixel
// (viewport) resolution and pastes it into the recordVideo canvas TOP-LEFT; it does
// NOT scale the page up to fill a larger canvas, and it does NOT capture device pixels
// from deviceScaleFactor. So to FILL the frame the recordVideo size must equal the
// viewport. We therefore:
//   · render the app at 1920x1080 CSS px with deviceScaleFactor 2 (text is rasterized
//     at 2x device pixels → supersampled, crisp),
//   · capture the recording at 1920x1080 (page fills the whole frame),
//   · ffmpeg lanczos-upscales 1920x1080 → 3840x2160 (or 2560x1440) @ 60fps.
// Because the source is already 2x-supersampled, the upscaled 4K is genuinely sharp.
const VIEWPORT = { width: 1920, height: 1080 };

export const test = base.extend({
  recordingName: ["showcase", { option: true }],

  context: async ({ browser, recordingName }, use) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `pw-showcase-${recordingName}-`));
    const context = await browser.newContext({
      // Render at 1080p @2x (supersampled, crisp text). Recording matches the viewport
      // so the app fills the frame; ffmpeg upscales to the target 4K/1440p below.
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      locale: "it-IT",
      recordVideo: { dir: tmpDir, size: VIEWPORT },
    });

    // Italian + pre-accepted privacy consent (same as the normal fixture).
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem("i18nextLng", "it");
        window.localStorage.setItem("privacyConsent", "true");
      } catch {
        /* localStorage may be unavailable before navigation */
      }
    });

    // Block + hide the iubenda cookie banner (same as the normal fixture).
    await context.route(/iubenda\.com/, (route) => route.abort());
    await context.addInitScript(() => {
      try {
        const style = document.createElement("style");
        style.textContent =
          "#iubenda-cs-banner, .iubenda-cs-container, #iubenda-cs-widget { display: none !important; }";
        document.documentElement.appendChild(style);
      } catch {
        /* best-effort */
      }
    });

    // THE SHOWCASE EXTRA: inject the visible cursor + click-ripple overlay.
    await context.addInitScript(CURSOR_OVERLAY_SCRIPT);

    await use(context);

    // Close so Playwright finalizes the .webm, then transcode → high-quality .mp4.
    const pages = context.pages();
    const video = pages[0]?.video();
    await context.close();

    if (video) {
      fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
      const webm = path.join(RECORDINGS_DIR, `demo-${recordingName}.webm`);
      const mp4 = path.join(RECORDINGS_DIR, `demo-${recordingName}.mp4`);
      const src = await video.path();
      await video.saveAs(webm);
      try {
        if (src && fs.existsSync(src)) fs.unlinkSync(src);
      } catch {
        /* best-effort cleanup */
      }

      // Transcode VP8/WebM → H.264/MP4 at the target resolution, 60fps encode,
      // high bitrate (crf 17, slow preset) for a crisp showcase. lanczos upscale.
      // SHOWCASE_FAST=1 → ultrafast/crf28 for quick dress-rehearsals (validation only,
      // not for the deliverable); the real record leaves it unset for slow/crf17.
      const FAST = !!process.env.SHOWCASE_FAST;
      try {
        execFileSync(
          "ffmpeg",
          [
            "-y",
            "-i", webm,
            "-vf", `scale=${RES.w}:${RES.h}:flags=${FAST ? "bilinear" : "lanczos"},fps=${FAST ? 30 : 60}`,
            "-c:v", "libx264",
            "-crf", FAST ? "30" : "17",
            "-preset", FAST ? "ultrafast" : "slow",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            mp4,
          ],
          { stdio: "inherit" },
        );
        fs.unlinkSync(webm);
      } catch (e) {
        // Keep the .webm so the run isn't a total loss if ffmpeg fails.
        console.error("[showcase] ffmpeg transcode failed:", e?.message || e);
      }
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  },
});

export { expect };
