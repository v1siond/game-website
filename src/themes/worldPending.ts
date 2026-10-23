import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from './themes'

/** Set on <html> while a returning visitor's stored world (or a `?capture=` world) has not replaced the
 *  server rendered default yet. globals.css hides the world root under it; ThemeProvider removes it once
 *  the picked world has rendered. */
export const WORLD_PENDING_ATTR = 'data-world-pending'

// Runs inline before the world markup is parsed, so the default world never paints for a visitor who
// picked another one. A fresh visitor (and every crawler) has nothing stored and sees the server HTML.
export const WORLD_PENDING_SCRIPT = `try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var c=new URLSearchParams(location.search).get('capture');var d=${JSON.stringify(DEFAULT_THEME_ID)};if((s&&s!==d)||(c&&c!==d))document.documentElement.setAttribute(${JSON.stringify(WORLD_PENDING_ATTR)},'')}catch(e){}`
