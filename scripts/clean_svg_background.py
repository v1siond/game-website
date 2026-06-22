#!/usr/bin/env python3
"""
Remove checkered background from SVG sprite sheets.
The background consists of alternating gray squares.
"""
import re
import os

INPUT_SVG = "public/sprites/kratos_sheet2.svg"
OUTPUT_SVG = "public/sprites/kratos_sheet2_clean.svg"

# Gray colors used in checkered background (light and dark squares)
# These are rgb(180-185, 179-183, 179-183) and rgb(222-226, 221-225, 221-225)
BACKGROUND_COLORS = set()

def is_background_gray(color_str):
    """Check if a color is one of the background grays."""
    match = re.match(r'rgb\((\d+),(\d+),(\d+)\)', color_str)
    if not match:
        return False

    r, g, b = int(match.group(1)), int(match.group(2)), int(match.group(3))

    # Light gray squares: ~224
    if 218 <= r <= 230 and 218 <= g <= 230 and 218 <= b <= 230:
        if abs(r - g) <= 3 and abs(g - b) <= 3:  # Nearly equal RGB = gray
            return True

    # Dark gray squares: ~181
    if 176 <= r <= 190 and 176 <= g <= 190 and 176 <= b <= 190:
        if abs(r - g) <= 5 and abs(g - b) <= 5:
            return True

    return False


def clean_svg(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_paths = len(re.findall(r'<path', content))

    # Remove paths with background fill colors
    def should_keep_path(match):
        path_tag = match.group(0)
        fill_match = re.search(r'fill="([^"]*)"', path_tag)
        if fill_match:
            fill = fill_match.group(1)
            if is_background_gray(fill):
                return ''  # Remove this path
        return path_tag  # Keep it

    cleaned = re.sub(r'<path[^>]*/>', should_keep_path, content)
    cleaned = re.sub(r'<path[^>]*>.*?</path>', should_keep_path, cleaned, flags=re.DOTALL)

    remaining_paths = len(re.findall(r'<path', cleaned))
    removed = original_paths - remaining_paths

    print(f"Original paths: {original_paths}")
    print(f"Removed: {removed} background paths")
    print(f"Remaining: {remaining_paths} character paths")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(cleaned)

    print(f"Saved to: {output_path}")
    return remaining_paths


if __name__ == "__main__":
    clean_svg(INPUT_SVG, OUTPUT_SVG)
