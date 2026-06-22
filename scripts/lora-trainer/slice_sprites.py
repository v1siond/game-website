#!/usr/bin/env python3
"""
Sprite Sheet Slicer & Auto-Captioner
Extracts individual frames and generates training captions
"""

import os
import sys
from pathlib import Path
from PIL import Image
import json
import argparse

def detect_grid(img, bg_threshold=10):
    """Auto-detect sprite grid by finding consistent gaps"""
    width, height = img.size
    pixels = img.load()

    # Sample rows/cols to find sprite boundaries
    # Look for vertical lines of transparency/background
    v_gaps = []
    for x in range(width):
        col_empty = True
        for y in range(0, height, max(1, height // 20)):
            if img.mode == 'RGBA':
                if pixels[x, y][3] > bg_threshold:
                    col_empty = False
                    break
            else:
                # Non-RGBA: check if pixel is close to corner (background)
                corner = pixels[0, 0]
                if abs(sum(pixels[x, y][:3]) - sum(corner[:3] if isinstance(corner, tuple) else [corner]*3)) > 50:
                    col_empty = False
                    break
        if col_empty:
            v_gaps.append(x)

    # Find sprite boundaries from gaps
    sprites_x = []
    if v_gaps:
        start = 0
        for i, x in enumerate(v_gaps):
            if i == 0 or x > v_gaps[i-1] + 1:
                if start < x - 5:  # Min sprite width
                    sprites_x.append((start, x))
                start = x + 1
        if start < width - 5:
            sprites_x.append((start, width))

    return sprites_x if sprites_x else [(0, width)]


def slice_uniform_grid(img, cols, rows):
    """Slice image into uniform grid"""
    width, height = img.size
    cell_w = width // cols
    cell_h = height // rows

    frames = []
    for row in range(rows):
        for col in range(cols):
            x1 = col * cell_w
            y1 = row * cell_h
            x2 = x1 + cell_w
            y2 = y1 + cell_h

            frame = img.crop((x1, y1, x2, y2))

            # Skip empty frames
            if img.mode == 'RGBA':
                bbox = frame.getbbox()
                if bbox is None:
                    continue

            frames.append({
                'image': frame,
                'row': row,
                'col': col,
                'position': f"row{row}_col{col}"
            })

    return frames


def auto_caption(frame_info, character_name, style_tags):
    """Generate caption for a sprite frame"""
    row = frame_info['row']
    col = frame_info['col']

    # Common action mapping by row (most sprite sheets follow this)
    row_actions = [
        "idle pose",
        "walking",
        "running",
        "jumping",
        "attacking",
        "special attack",
        "hurt",
        "death"
    ]

    action = row_actions[row] if row < len(row_actions) else f"action{row}"
    frame_num = col + 1

    caption = f"{character_name}, {style_tags}, {action}, frame {frame_num}, game sprite, transparent background"

    return caption


def process_spritesheet(
    input_path: str,
    output_dir: str,
    character_name: str = "character",
    style_tags: str = "pixel art",
    cols: int = None,
    rows: int = None,
    auto_detect: bool = True
):
    """Process a single sprite sheet"""

    img = Image.open(input_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    print(f"Processing: {input_path}")
    print(f"  Size: {img.size}")

    # Detect or use specified grid
    if cols and rows:
        frames = slice_uniform_grid(img, cols, rows)
    else:
        # Auto-detect: assume uniform grid, try common layouts
        width, height = img.size

        # Try to detect from aspect ratio
        aspect = width / height
        if aspect > 4:  # Wide strip
            cols = max(4, width // height)
            rows = 1
        elif aspect < 0.5:  # Tall strip
            cols = 1
            rows = max(4, height // width)
        else:
            # Square-ish, try common grids
            cols = 8
            rows = max(1, height // (width // 8))

        frames = slice_uniform_grid(img, cols, rows)

    print(f"  Grid: {cols}x{rows}, extracted {len(frames)} frames")

    # Save frames with captions
    os.makedirs(output_dir, exist_ok=True)

    base_name = Path(input_path).stem

    for i, frame in enumerate(frames):
        # Save image
        img_name = f"{base_name}_{frame['position']}.png"
        img_path = os.path.join(output_dir, img_name)

        # Crop to content bounds
        bbox = frame['image'].getbbox()
        if bbox:
            cropped = frame['image'].crop(bbox)
            # Resize to consistent size (512x512 for SD training)
            cropped.thumbnail((512, 512), Image.Resampling.LANCZOS)
            # Paste onto 512x512 canvas
            canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
            paste_x = (512 - cropped.width) // 2
            paste_y = (512 - cropped.height) // 2
            canvas.paste(cropped, (paste_x, paste_y))
            canvas.save(img_path)
        else:
            continue

        # Save caption
        caption = auto_caption(frame, character_name, style_tags)
        txt_path = img_path.replace('.png', '.txt')
        with open(txt_path, 'w') as f:
            f.write(caption)

    print(f"  Saved to: {output_dir}")
    return len(frames)


def main():
    parser = argparse.ArgumentParser(description='Slice sprite sheets for LoRA training')
    parser.add_argument('input', nargs='+', help='Input sprite sheet(s) or directory')
    parser.add_argument('-o', '--output', default='./training_data', help='Output directory')
    parser.add_argument('-n', '--name', default='sprite', help='Character/style name for captions')
    parser.add_argument('-s', '--style', default='pixel art sprite', help='Style tags')
    parser.add_argument('--cols', type=int, help='Number of columns (auto-detect if not set)')
    parser.add_argument('--rows', type=int, help='Number of rows (auto-detect if not set)')

    args = parser.parse_args()

    total_frames = 0

    for input_path in args.input:
        path = Path(input_path)

        if path.is_dir():
            for img_file in path.glob('*.png'):
                total_frames += process_spritesheet(
                    str(img_file),
                    args.output,
                    args.name,
                    args.style,
                    args.cols,
                    args.rows
                )
        elif path.exists():
            total_frames += process_spritesheet(
                str(path),
                args.output,
                args.name,
                args.style,
                args.cols,
                args.rows
            )
        else:
            print(f"Warning: {input_path} not found")

    print(f"\n=== Done! Extracted {total_frames} frames ===")
    print(f"Training data saved to: {args.output}")


if __name__ == '__main__':
    main()
