#!/bin/bash
# One-command LoRA training for sprites
# Usage: ./train_all.sh /path/to/sprites -n character_name

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"
DATA_DIR="$SCRIPT_DIR/training_data"
OUTPUT_DIR="$SCRIPT_DIR/output"

# Parse args
SPRITES_PATH="${1:-}"
NAME="${2:-sprite}"
STEPS="${3:-2000}"

if [ -z "$SPRITES_PATH" ]; then
    echo "Usage: $0 <sprites_path> [name] [steps]"
    echo ""
    echo "Examples:"
    echo "  $0 ./kratos_sprites.png kratos 2000"
    echo "  $0 ./sprite_folder/ knight 3000"
    exit 1
fi

# Setup if needed
if [ ! -d "$VENV_DIR" ]; then
    echo "First run - setting up environment..."
    bash "$SCRIPT_DIR/setup.sh"
fi

# Activate venv
source "$VENV_DIR/bin/activate"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            SPRITE LoRA TRAINING PIPELINE                   ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Input:  $SPRITES_PATH"
echo "║  Name:   $NAME"
echo "║  Steps:  $STEPS"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Slice sprites
echo "[1/3] Slicing sprite sheets..."
python "$SCRIPT_DIR/slice_sprites.py" "$SPRITES_PATH" \
    -o "$DATA_DIR" \
    -n "$NAME" \
    -s "pixel art game sprite"

# Count training images
IMG_COUNT=$(find "$DATA_DIR" -name "*.png" | wc -l)
echo "  -> $IMG_COUNT training images prepared"

if [ "$IMG_COUNT" -lt 5 ]; then
    echo "Warning: Very few images. Consider adding more sprites."
fi

# Step 2: Train LoRA
echo ""
echo "[2/3] Training LoRA (this will take 20-60 minutes)..."
python "$SCRIPT_DIR/train_sprites.py" "$DATA_DIR" \
    -o "$OUTPUT_DIR" \
    -n "${NAME}_lora" \
    -s "$STEPS"

# Step 3: Done!
echo ""
echo "[3/3] Complete!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    TRAINING COMPLETE                        ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  LoRA saved: $OUTPUT_DIR/${NAME}_lora.safetensors"
echo "║                                                              ║"
echo "║  To use in Automatic1111:                                    ║"
echo "║  1. Copy .safetensors to models/Lora/                        ║"
echo "║  2. Use <lora:${NAME}_lora:0.8> in prompt                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
