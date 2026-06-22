// Human-like pacing for demo-tour recordings.
//
// Mirrors src/tests/utils/recording.js so tours feel hand-operated: land on a
// screen, read it, spot the target, click, watch the effect. Scale everything
// globally with RECORD_SCALE (e.g. RECORD_SCALE=1.5 = 50% slower).
//
// Each helper takes the Playwright `page` and returns a promise, so a spec reads
// like a script:  await see(page);  await page.getByRole(...).click();  await afterAction(page);

const SCALE = Number(process.env.RECORD_SCALE) || 1;

const pause = (page, ms) => page.waitForTimeout(Math.round(ms * SCALE));

// Semantic beats — name them after what a user is doing.
export const see = (page) => pause(page, 2600); // land on a screen and take it in
export const read = (page) => pause(page, 2100); // read a result / some content
export const think = (page) => pause(page, 1300); // spot the target, decide to act
export const afterAction = (page) => pause(page, 1700); // watch the effect of a click/selection
export const beat = (page, ms = 1400) => pause(page, ms); // arbitrary custom pause

// Type one character at a time, like a person — use instead of locator.fill()
// so the recording shows the text being typed. `target` is a locator or selector.
export const type = async (page, target, text) => {
  const el = typeof target === "string" ? page.locator(target) : target;
  await el.click();
  await el.pressSequentially(String(text), { delay: Math.round(55 * SCALE) });
};

// Scroll the viewport by `px` (positive = down) so the page moves naturally.
export const scroll = async (page, px = 450) => {
  await page.mouse.wheel(0, px);
  await pause(page, 900);
};

// Gently bring an element into view (a natural scroll) + a beat to settle.
export const scrollTo = async (page, target) => {
  const el = typeof target === "string" ? page.locator(target) : target;
  await el.scrollIntoViewIfNeeded();
  await pause(page, 900);
};
