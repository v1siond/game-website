#!/usr/bin/env python3
"""
Slice Pixelcut Kratos sprite sheet into individual frames.
Creates both right-facing (original) and left-facing (mirrored) versions.

Usage: python3 scripts/slice_pixelcut.py
"""
from PIL import Image
import os

SPRITE_SHEET = "public/sprites/kratos_pixelcut.png"
OUTPUT_DIR = "public/sprites/kratos"

# Frame dimensions (manually tuned for Pixelcut output)
SPRITE_WIDTH = 100
SPRITE_HEIGHT = 180
ROW_HEIGHT = 240
Y_START_OFFSET = 40  # Skip label text

# X centers of each sprite (not evenly spaced - AI output quirk)
SPRITE_CENTERS = [160, 285, 410, 520]

ROWS = [
    ("idle", 0),
    ("walk", 1),
    ("attack", 2),
    ("jump", 3),
    ("run", 4),
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(f"{OUTPUT_DIR}/left", exist_ok=True)

    img = Image.open(SPRITE_SHEET)
    print(f"Loaded: {SPRITE_SHEET} ({img.size[0]}x{img.size[1]})")

    half_w = SPRITE_WIDTH // 2
    total = 0

    for row_name, row_idx in ROWS:
        y_start = (row_idx * ROW_HEIGHT) + Y_START_OFFSET

        for col, cx in enumerate(SPRITE_CENTERS):
            x1 = cx - half_w
            x2 = cx + half_w
            y1 = y_start
            y2 = y_start + SPRITE_HEIGHT

            frame = img.crop((x1, y1, x2, y2))
            frame.save(f"{OUTPUT_DIR}/{row_name}_{col}.png")

            left_frame = frame.transpose(Image.FLIP_LEFT_RIGHT)
            left_frame.save(f"{OUTPUT_DIR}/left/{row_name}_{col}.png")
            total += 1

    print(f"Extracted {total} frames to {OUTPUT_DIR}/")
    print(f"Mirrored copies in {OUTPUT_DIR}/left/")


if __name__ == "__main__":
    main()
