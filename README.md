# StravaRunStats

## Dependencies:
Python 3:
sudo apt install python3-full

pip:
sudo apt install python3-pip

venv:
sudo apt install python3-venv

create venv:
python3 -m venv ./.venv

Tesseract OCR:
sudo apt install tesseract-ocr

pytesseract:
.venv/bin/pip install pytesseract

numpy:
.venv/bin/pip install numpy

.venv/bin/python3 extract.py <directory/file>