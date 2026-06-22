#!/bin/bash
# LoRA Sprite Training Setup
# RTX 4080 16GB optimized

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"

echo "=== LoRA Sprite Trainer Setup ==="

# Create virtual environment with Python 3.10+
if ! command -v python3.10 &> /dev/null; then
    echo "Installing Python 3.10..."
    sudo apt update
    sudo apt install -y python3.10 python3.10-venv python3.10-dev
fi

# Create venv
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    python3.10 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip

# PyTorch with CUDA 12.x
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# Training dependencies
pip install \
    accelerate \
    transformers \
    diffusers \
    safetensors \
    xformers \
    bitsandbytes \
    lion-pytorch \
    prodigyopt \
    dadaptation \
    Pillow \
    numpy \
    tqdm

# Clone kohya_ss (training scripts)
if [ ! -d "$SCRIPT_DIR/sd-scripts" ]; then
    echo "Cloning kohya sd-scripts..."
    git clone https://github.com/kohya-ss/sd-scripts.git "$SCRIPT_DIR/sd-scripts"
    cd "$SCRIPT_DIR/sd-scripts"
    pip install -r requirements.txt
fi

echo ""
echo "=== Setup Complete ==="
echo "Activate with: source $VENV_DIR/bin/activate"
echo "Run training with: python train_sprites.py"
