// ─────────────────────────────────────────────────────────────
// Showcase helpers — for the high-quality MASTER SHOWCASE recording only.
//
// Headless Chromium renders NO cursor and Playwright's mouse API teleports, so a
// normal tour shows text appearing and clicks landing with nothing in between.
// These helpers add the production polish the showcase needs:
//
//   · CURSOR_OVERLAY_SCRIPT — an addInitScript that injects a fake pointer + a
//     click ripple that follow real mouse events, so cursor travel and clicks are
//     VISIBLE on screen.
//   · humanType(page, target, text) — pressSequentially with a VARIABLE per-char
//     delay (jitter, longer after spaces/punctuation, occasional thinking pauses)
//     so typing reads as a person, not a paste.
//   · moveClick(page, target) — glides the real mouse to the element's centre in
//     steps (so the overlay cursor travels), beats, then clicks.
//   · moveHover(page, target) — same glide, no click (for "point at this" beats).
//
// These are ADDITIVE. The normal record:tour path (video.js / pacing.js) is
// untouched, so the per-section tours stay 1080p with their existing pacing.
// ─────────────────────────────────────────────────────────────

// Injected into every page before any app script runs. Builds a fixed-position
// pointer SVG + a ripple layer that track document-level mouse events. Pure DOM,
// pointer-events:none, very high z-index so it floats over everything and never
// interferes with clicks. Mirrors the real OS cursor's hot-spot at the tip.
export const CURSOR_OVERLAY_SCRIPT = () => {
  const install = () => {
    if (window.__showcaseCursorInstalled) return;
    if (!document.body) {
      // body not ready yet — retry on DOMContentLoaded
      document.addEventListener("DOMContentLoaded", install, { once: true });
      return;
    }
    window.__showcaseCursorInstalled = true;

    const Z = 2147483647; // max int — sit above every app/modal layer

    // The pointer. A classic arrow drawn as inline SVG so it's crisp at 4K and
    // needs no asset. White fill + dark outline reads on light and dark UIs.
    const cursor = document.createElement("div");
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.cssText = [
      "position:fixed",
      "left:0",
      "top:0",
      "width:28px",
      "height:28px",
      "z-index:" + Z,
      "pointer-events:none",
      "will-change:transform",
      "transform:translate(-2px,-2px)",
      "filter:drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
      "transition:transform 0.02s linear",
    ].join(";");
    cursor.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M5 3 L5 22 L10.2 17 L13.6 24.2 L16.8 22.7 L13.4 15.6 L20.5 15.6 Z" ' +
      'fill="#ffffff" stroke="#111111" stroke-width="1.3" stroke-linejoin="round"/>' +
      "</svg>";

    // Layer that holds transient click ripples.
    const rippleLayer = document.createElement("div");
    rippleLayer.setAttribute("aria-hidden", "true");
    rippleLayer.style.cssText = [
      "position:fixed",
      "left:0",
      "top:0",
      "width:0",
      "height:0",
      "z-index:" + (Z - 1),
      "pointer-events:none",
    ].join(";");

    // Keyframes for the ripple expand/fade (injected once).
    const style = document.createElement("style");
    style.textContent =
      "@keyframes __showcaseRipple{0%{transform:translate(-50%,-50%) scale(0.2);opacity:0.55}" +
      "100%{transform:translate(-50%,-50%) scale(1);opacity:0}}";

    const mount = () => {
      document.documentElement.appendChild(style);
      document.body.appendChild(rippleLayer);
      document.body.appendChild(cursor);
    };
    mount();
    // Re-attach if some app re-render wipes body children (defensive).
    const ensure = () => {
      if (!cursor.isConnected || !rippleLayer.isConnected) {
        try {
          mount();
        } catch {
          /* ignore */
        }
      }
    };

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    const place = (x, y) => {
      lastX = x;
      lastY = y;
      cursor.style.transform = "translate(" + (x - 2) + "px," + (y - 2) + "px)";
    };
    place(lastX, lastY);

    document.addEventListener(
      "mousemove",
      (e) => {
        place(e.clientX, e.clientY);
        ensure();
      },
      true,
    );

    document.addEventListener(
      "mousedown",
      (e) => {
        const x = e.clientX || lastX;
        const y = e.clientY || lastY;
        // squeeze the pointer slightly on press for feedback
        cursor.style.transform =
          "translate(" + (x - 2) + "px," + (y - 2) + "px) scale(0.85)";
        const r = document.createElement("div");
        r.style.cssText = [
          "position:fixed",
          "left:" + x + "px",
          "top:" + y + "px",
          "width:46px",
          "height:46px",
          "margin:0",
          "border-radius:50%",
          "background:radial-gradient(circle,rgba(37,99,235,0.45) 0%,rgba(37,99,235,0.15) 55%,rgba(37,99,235,0) 70%)",
          "border:2px solid rgba(37,99,235,0.55)",
          "pointer-events:none",
          "animation:__showcaseRipple 0.5s ease-out forwards",
        ].join(";");
        rippleLayer.appendChild(r);
        setTimeout(() => r.remove(), 600);
      },
      true,
    );

    document.addEventListener(
      "mouseup",
      (e) => {
        const x = e.clientX || lastX;
        const y = e.clientY || lastY;
        cursor.style.transform = "translate(" + (x - 2) + "px," + (y - 2) + "px)";
      },
      true,
    );
  };

  install();
};

// ── Realistic typing ──────────────────────────────────────────
// Type char-by-char with a human cadence. Most keystrokes land near `base` ms with
// random jitter; spaces and sentence punctuation add a short beat; occasionally the
// "typist" pauses to think. Tunable via SHOWCASE_TYPE_SCALE (default 1).
const TYPE_SCALE = Number(process.env.SHOWCASE_TYPE_SCALE) || 1;

const sleep = (page, ms) => page.waitForTimeout(Math.max(0, Math.round(ms)));

export const humanType = async (page, target, text) => {
  const el = typeof target === "string" ? page.locator(target) : target;
  await el.scrollIntoViewIfNeeded().catch(() => {});
  // Glide the cursor to the field and click into it so focus + cursor read right.
  await moveClick(page, el);
  await sleep(page, 180 * TYPE_SCALE);

  const str = String(text);
  const base = 68; // ~68ms/char baseline ≈ a brisk-but-human typist
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    let delay = base + (Math.random() * 46 - 18); // base ± jitter (slightly right-skewed)

    const prev = str[i - 1];
    if (prev === " ") delay += 35 + Math.random() * 45; // small reset after a space
    if (prev && ".,;:!?".includes(prev)) delay += 90 + Math.random() * 130; // beat after punctuation

    // occasional "thinking" pause mid-word (~4% of keystrokes)
    if (Math.random() < 0.04) delay += 200 + Math.random() * 200;

    await el.pressSequentially(ch, { delay: Math.round(delay * TYPE_SCALE) });
  }
};

// ── Realistic mouse glide + click ─────────────────────────────
const centerOf = async (locator) => {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  const box = await locator.boundingBox();
  if (!box) return null;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

// Glide the real mouse to the element's centre (so the overlay cursor travels),
// hold a short beat, then click. Steps make the motion visible at recording fps.
export const moveClick = async (page, target, opts = {}) => {
  const el = typeof target === "string" ? page.locator(target) : target;
  const c = await centerOf(el);
  if (c) {
    await page.mouse.move(c.x, c.y, { steps: opts.steps ?? 18 });
    await sleep(page, opts.settle ?? 220);
    await page.mouse.down();
    await sleep(page, 60);
    await page.mouse.up();
  } else {
    // Element has no box (e.g. zero-size) — fall back to a plain click.
    await el.click();
  }
};

// Glide to an element and hover, no click — for "point at this" beats.
export const moveHover = async (page, target, opts = {}) => {
  const el = typeof target === "string" ? page.locator(target) : target;
  const c = await centerOf(el);
  if (c) {
    await page.mouse.move(c.x, c.y, { steps: opts.steps ?? 16 });
    await sleep(page, opts.settle ?? 200);
  } else {
    await el.hover().catch(() => {});
  }
};

// Move the mouse to absolute viewport coords (for parking the cursor naturally).
export const moveTo = async (page, x, y, steps = 16) => {
  await page.mouse.move(x, y, { steps });
};
