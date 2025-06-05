
StravaRunStats
==============

A FastAPI backend with a React frontend that extracts and analyzes running data from image uploads using OCR.

Contents:
1. [Backend](#backend)
2. [Frontend](#frontend)

# Backend
___
Requirements
------------
- Python 3
- Tesseract OCR

Dependencies
------------

The following tools and libraries are required:

System Packages (Ubuntu/Debian):

```
sudo apt update
sudo apt install -y python3-full python3-pip python3-venv tesseract-ocr
```

Python Packages:

You can install all Python dependencies using the provided virtual environment:

```
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

Then install dependencies:

```
pip install -r requirements.txt
```

Required Python packages:

- pytesseract
- numpy
- opencv-python
- pillow
- sqlalchemy
- fastapi[standard]
- uvicorn

Usage
-----

Run Backend Server

```
chmod +x backend/run_server.sh
./backend/run_server.sh
```

This starts the FastAPI server with live reload enabled.

Initialization Script
---------------------

You can run the following script to automatically set up everything:

init.sh
----------------
```
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
```

Make it executable and run it:

    chmod +x init.sh
    ./init.sh

requirements.txt
----------------

    pytesseract
    numpy
    opencv-python
    pillow
    sqlalchemy
    fastapi[standard]
    uvicorn

# Frontend
___
Requirements
------------

- Node (npm)
- React

Dependencies
------------

```
cd frontend/
npm install
```