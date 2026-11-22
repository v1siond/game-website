// The one place the site touches Web Storage. A browser set to block site data (private mode, disabled
// cookies) throws on any access, so a read then answers null and a write keeps nothing: whatever was to be
// remembered lasts for this page view only. worldPending.ts keeps its own try, being an inline script.

export type StorageArea = 'local' | 'session'

const AREA: Record<StorageArea, () => Storage> = {
  local: () => window.localStorage,
  session: () => window.sessionStorage,
}

/** The stored value under `key`, or null when there is none or storage is blocked. */
export function readStored(area: StorageArea, key: string): string | null {
  try {
    return AREA[area]().getItem(key)
  } catch {
    return null
  }
}

/** Keeps `value` under `key`; blocked storage keeps nothing and the page goes on without it. */
export function writeStored(area: StorageArea, key: string, value: string): void {
  try {
    AREA[area]().setItem(key, value)
  } catch {
    // nothing to keep: the value lasts for this page view only
  }
}
