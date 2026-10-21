/**
 * A name written as several names joined by slashes ("DailyDrip/SmoothTerminal"), cut after each slash. The
 * slash stays on the part before it, so a line that breaks there ends on the slash and no name is split.
 */
export const slashParts = (text: string): string[] => text.match(/[^/]*\/+|[^/]+$/g) ?? []
