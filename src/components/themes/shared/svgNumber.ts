// Trig results rounded to 3 decimals, so the server's and the browser's last float digit agree and a
// server rendered SVG hydrates without an attribute mismatch.
export const svgNumber = (n: number): number => Math.round(n * 1000) / 1000
