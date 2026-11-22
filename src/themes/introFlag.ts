/** Set on <html> when the default world's entrance will play: JavaScript runs and the visitor allows motion.
 *  Adventure Paths' hide rules (map.module.css, side.module.css) key on it, so a visitor with no JavaScript,
 *  or one who asks for reduced motion, gets the finished map from the server HTML. */
export const INTRO_ATTR = 'data-intro'

// Runs inline before the world markup is parsed (like worldPending.ts), so the entrance hides its pieces
// before the first paint. An inline script cannot import, so it repeats useReducedMotion's query.
export const INTRO_SCRIPT = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute(${JSON.stringify(INTRO_ATTR)},'')}catch(e){}`
