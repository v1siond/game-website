#!/usr/bin/env python3
"""
LoRA Training Script for Game Sprites
Optimized for RTX 4080 16GB
"""

import os
import sys
import subprocess
import argparse
import json
from pathlib import Path

# Training config optimized for RTX 4080 16GB
DEFAULT_CONFIG = {
    # Model
    "pretrained_model": "runwayml/stable-diffusion-v1-5",  # or use SDXL
    "output_dir": "./output",
    "output_name": "sprite_lora",

    # Training params - optimized for 16GB VRAM
    "resolution": 512,
    "train_batch_size": 2,
    "gradient_accumulation_steps": 4,
    "learning_rate": 1e-4,
    "lr_scheduler": "cosine",
    "lr_warmup_steps": 100,
    "max_train_steps": 2000,

    # LoRA specific
    "network_dim": 32,  # LoRA rank (32-128 for sprites)
    "network_alpha": 16,  # Usually dim/2

    # Memory optimization
    "mixed_precision": "fp16",
    "gradient_checkpointing": True,
    "xformers": True,
    "cache_latents": True,

    # Regularization
    "noise_offset": 0.1,
    "keep_tokens": 1,

    # Saving
    "save_every_n_steps": 500,
    "save_model_as": "safetensors",
}


def create_dataset_config(data_dir: str, config_path: str, repeats: int = 10):
    """Create dataset config for kohya training"""

    config = {
        "general": {
            "shuffle_caption": True,
            "keep_tokens": 1,
        },
        "datasets": [{
            "resolution": 512,
            "batch_size": 2,
            "subsets": [{
                "image_dir": data_dir,
                "num_repeats": repeats,
                "caption_extension": ".txt",
            }]
        }]
    }

    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)

    return config_path


def run_training(
    data_dir: str,
    output_dir: str = "./output",
    model_name: str = "sprite_lora",
    steps: int = 2000,
    base_model: str = "runwayml/stable-diffusion-v1-5"
):
    """Run LoRA training with kohya sd-scripts"""

    script_dir = Path(__file__).parent
    sd_scripts = script_dir / "sd-scripts"

    if not sd_scripts.exists():
        print("Error: sd-scripts not found. Run setup.sh first!")
        sys.exit(1)

    # Create output dir
    os.makedirs(output_dir, exist_ok=True)

    # Create dataset config
    dataset_config = create_dataset_config(
        data_dir,
        os.path.join(output_dir, "dataset.json")
    )

    # Build training command
    cmd = [
        sys.executable,
        str(sd_scripts / "train_network.py"),

        # Model
        "--pretrained_model_name_or_path", base_model,
        "--output_dir", output_dir,
        "--output_name", model_name,

        # Dataset
        "--dataset_config", dataset_config,

        # Training
        "--max_train_steps", str(steps),
        "--learning_rate", "1e-4",
        "--lr_scheduler", "cosine",
        "--lr_warmup_steps", "100",
        "--resolution", "512",
        "--train_batch_size", "2",
        "--gradient_accumulation_steps", "4",

        # LoRA config
        "--network_module", "networks.lora",
        "--network_dim", "32",
        "--network_alpha", "16",

        # Memory optimization (RTX 4080)
        "--mixed_precision", "fp16",
        "--gradient_checkpointing",
        "--xformers",
        "--cache_latents",

        # Misc
        "--noise_offset", "0.1",
        "--save_every_n_steps", "500",
        "--save_model_as", "safetensors",
        "--logging_dir", os.path.join(output_dir, "logs"),
    ]

    print("=" * 60)
    print("Starting LoRA Training")
    print("=" * 60)
    print(f"Data:    {data_dir}")
    print(f"Output:  {output_dir}")
    print(f"Steps:   {steps}")
    print(f"Model:   {model_name}")
    print("=" * 60)

    # Run training
    subprocess.run(cmd, check=True)

    print("\n" + "=" * 60)
    print("Training Complete!")
    print(f"LoRA saved to: {output_dir}/{model_name}.safetensors")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description='Train LoRA for game sprites')
    parser.add_argument('data_dir', help='Directory with training images and captions')
    parser.add_argument('-o', '--output', default='./output', help='Output directory')
    parser.add_argument('-n', '--name', default='sprite_lora', help='Model name')
    parser.add_argument('-s', '--steps', type=int, default=2000, help='Training steps')
    parser.add_argument('--base', default='runwayml/stable-diffusion-v1-5',
                        help='Base model (SD 1.5 or SDXL)')

    args = parser.parse_args()

    run_training(
        args.data_dir,
        args.output,
        args.name,
        args.steps,
        args.base
    )


if __name__ == '__main__':
    main()
