#!/bin/bash
echo "Installing system dependencies..."
sudo apt update
sudo apt install -y python3-full python3-pip python3-venv tesseract-ocr
echo "Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt
echo "Setup complete. To activate your environment:"
echo "   source .venv/bin/activate"