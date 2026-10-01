/**
 * Generates the PWA and Apple touch icons in public/icons from an inline SVG.
 * Run with: npm run icons
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.join(process.cwd(), "public", "icons");

const BARN_RED = "#9E2A2B";
const CREAM = "#FEF8F0";

// A round chick with a check badge, drawn in a 512x512 box centred on 256,256
const chick = `
  <g>
    <!-- feet -->
    <path d="M216 430 v24 m-16 0 h32 M296 430 v24 m-16 0 h32"
      stroke="#E8833A" stroke-width="12" stroke-linecap="round" fill="none"/>
    <!-- tuft -->
    <path d="M256 120 C246 96 232 88 218 92 C236 100 242 112 246 126 Z
             M256 120 C258 92 270 78 288 78 C274 90 268 104 266 124 Z"
      fill="#EAB308"/>
    <!-- body -->
    <circle cx="256" cy="280" r="160" fill="#FACC15"/>
    <!-- wing -->
    <ellipse cx="388" cy="326" rx="38" ry="58" fill="#EAB308"
      transform="rotate(-24 388 326)"/>
    <!-- cheeks -->
    <circle cx="182" cy="296" r="20" fill="#F59E8B" opacity="0.6"/>
    <circle cx="330" cy="296" r="20" fill="#F59E8B" opacity="0.6"/>
    <!-- eyes -->
    <circle cx="206" cy="256" r="18" fill="#3B2A1A"/>
    <circle cx="306" cy="256" r="18" fill="#3B2A1A"/>
    <circle cx="212" cy="250" r="6" fill="#FFFFFF"/>
    <circle cx="312" cy="250" r="6" fill="#FFFFFF"/>
    <!-- beak -->
    <path d="M232 284 L280 284 L256 316 Z" fill="#E8833A"
      stroke="#E8833A" stroke-width="6" stroke-linejoin="round"/>
    <!-- check badge -->
    <circle cx="140" cy="150" r="58" fill="#5D8A48" stroke="${CREAM}" stroke-width="10"/>
    <path d="M114 152 L133 171 L168 132" stroke="#FFFFFF" stroke-width="14"
      stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>`;

/**
 * @param {object} opts
 * @param {boolean} opts.maskable Full-bleed background with the artwork kept
 *   inside the central 80% safe zone so any mask shape crops cleanly.
 */
function iconSvg({ maskable }) {
  const background = maskable
    ? `<rect width="512" height="512" fill="${BARN_RED}"/>`
    : `<rect width="512" height="512" rx="112" fill="${BARN_RED}"/>`;
  const scale = maskable ? 0.62 : 0.8;
  const offset = 256 * (1 - scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    ${background}
    <g transform="translate(${offset} ${offset + 10 * scale}) scale(${scale})">${chick}</g>
  </svg>`;
}

const ICONS = [
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-maskable-192.png", size: 192, maskable: true },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
  // iOS applies its own rounded mask, so use the full-bleed variant
  { file: "apple-touch-icon.png", size: 180, maskable: true },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { file, size, maskable } of ICONS) {
  await sharp(Buffer.from(iconSvg({ maskable })))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, file));
  console.log(`Wrote public/icons/${file}`);
}
