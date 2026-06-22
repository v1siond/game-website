#!/usr/bin/env python3
"""
Slice SVG sprite sheet into individual sprite SVG files.
Uses viewBox clipping to extract each frame with transparent background.

The SVG viewBox is 1529x2048, displayed at 896x1200.
We'll extract based on the viewBox coordinates.
"""
import os
import re

INPUT_SVG = "public/sprites/kratos_spritesheet_clean.svg"
OUTPUT_DIR = "public/sprites/kratos-svg"

# Original viewBox: 0 0 1529 2048 (scaled to 896x1200)
# Scale factor: 1529/896 = 1.706, 2048/1200 = 1.707
SCALE = 1529 / 896  # ~1.706

# Frame dimensions in viewBox coordinates
SPRITE_WIDTH = int(100 * SCALE)   # ~170
SPRITE_HEIGHT = int(180 * SCALE)  # ~307
ROW_HEIGHT = int(240 * SCALE)     # ~410
Y_OFFSET = int(40 * SCALE)        # ~68

# Sprite centers (from PNG extraction, scaled to viewBox)
SPRITE_CENTERS_X = [int(x * SCALE) for x in [160, 285, 410, 520]]
# Results: ~273, 486, 700, 887

ROWS = [
    ("idle", 0),
    ("walk", 1),
    ("attack", 2),
    ("jump", 3),
    ("run", 4),
]

def extract_sprite_svg(svg_content: str, x: int, y: int, w: int, h: int) -> str:
    """
    Create a new SVG that shows only a specific region of the original.
    Uses a nested SVG with adjusted viewBox for clipping.
    """
    # Find the original viewBox
    viewbox_match = re.search(r'viewBox="([^"]+)"', svg_content)
    orig_viewbox = viewbox_match.group(1) if viewbox_match else "0 0 1529 2048"

    # Extract everything between <defs> and closing </svg>
    defs_match = re.search(r'(<defs>.*?</defs>)', svg_content, re.DOTALL)
    defs = defs_match.group(1) if defs_match else ""

    # Extract all path/shape elements (everything after </defs> until </svg>)
    content_match = re.search(r'</defs>\s*(.*?)\s*</svg>', svg_content, re.DOTALL)
    content = content_match.group(1) if content_match else ""

    # Create new SVG with clipped viewBox
    new_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" width="{w}" height="{h}">
{defs}
{content}
</svg>'''

    return new_svg


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/left", exist_ok=True)

    with open(INPUT_SVG, 'r', encoding='utf-8') as f:
        svg_content = f.read()

    print(f"Loaded SVG: {len(svg_content)} bytes")

    half_w = SPRITE_WIDTH // 2
    total = 0

    for row_name, row_idx in ROWS:
        y_start = (row_idx * ROW_HEIGHT) + Y_OFFSET

        for col, cx in enumerate(SPRITE_CENTERS_X):
            x1 = cx - half_w
            y1 = y_start

            # Extract sprite SVG
            sprite_svg = extract_sprite_svg(
                svg_content,
                x1, y1,
                SPRITE_WIDTH, SPRITE_HEIGHT
            )

            # Save right-facing
            out_path = f"{OUTPUT_DIR}/{row_name}_{col}.svg"
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(sprite_svg)

            # For left-facing, we'll add a transform
            left_svg = sprite_svg.replace(
                f'viewBox="{x1} {y1} {SPRITE_WIDTH} {SPRITE_HEIGHT}"',
                f'viewBox="{x1} {y1} {SPRITE_WIDTH} {SPRITE_HEIGHT}" transform="scale(-1,1)"'
            )
            # Actually, SVG flip is trickier - let's use a group transform
            left_svg = sprite_svg.replace(
                '</defs>',
                f'</defs>\n<g transform="translate({SPRITE_WIDTH}, 0) scale(-1, 1)">'
            ).replace('</svg>', '</g>\n</svg>')

            left_path = f"{OUTPUT_DIR}/left/{row_name}_{col}.svg"
            with open(left_path, 'w', encoding='utf-8') as f:
                f.write(left_svg)

            total += 1
            print(f"  {row_name}_{col}: viewBox({x1}, {y1}, {SPRITE_WIDTH}, {SPRITE_HEIGHT})")

    print(f"\nExtracted {total} SVG sprites to {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
