import sys
import os
import pathlib
import re

from PIL import Image
import pytesseract
import numpy as np

n = len(sys.argv)

def formatText(text: str):

    ro_months = {
        'ianuarie': '01', 'februarie': '02', 'martie': '03', 'aprilie': '04',
        'mai': '05', 'iunie': '06', 'iulie': '07', 'august': '08',
        'septembrie': '09', 'octombrie': '10', 'noiembrie': '11', 'decembrie': '12'
    }

    date_match = re.search(r'(\d{1,2}) (\w+) (\d{4})', text)

    if date_match:
        day, month_ro, year = date_match.groups()
        month_num = ro_months.get(month_ro.lower())
        formatted_date = f"{int(day):02d}/{month_num}/{year}"
    else:
        formatted_date = "Not found"

    dist_match = re.search(r'(\d+(?:\.\d+)?)\s?km', text, re.IGNORECASE)
    distance = dist_match.group(0) if dist_match else "Not found"

    time_match = re.search(r'(\d+\s?m\s?\d+\s?s)', text)
    time = time_match.group(1).replace(" ", "") if time_match else "Not found"

    pace_match = re.search(r'(\d+:\d+)\s*/\s?km', text)
    pace = f"{pace_match.group(1)}/km" if pace_match else "Not found"

    print(f"Date - {formatted_date}")
    print(f"Distance - {distance}")
    print(f"Time - {time}")
    print(f"Pace - {pace}")

if (n != 2):

    print('Incorrect usage: .venv/bin/python3 extract.py [directory/image]')
    exit

if (os.path.isdir(sys.argv[1]) == True):

    files = [f for f in pathlib.Path(sys.argv[1]).iterdir() if f.is_file()]

    for f in files:
        
        img = np.array(Image.open(f))
        height = img.shape[0]
        cropped_img = img[int(0.64 * height):height, :]
        text = pytesseract.image_to_string(cropped_img)
        print(f"Text from {f.name}:")
        formatText(text)

    exit

elif (os.path.isfile(sys.argv[1]) == True):

    if ((pathlib.Path(sys.argv[1]).suffix) not in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tif', '.tiff', '.heic', '.heif', '.apng', '.ico']):
        print('Image extension not accepted.')
        exit

    img = np.array(Image.open(sys.argv[1]))
    height = img.shape[0]
    cropped_img = img[int(0.64 * height):height, :]
    text = pytesseract.image_to_string(cropped_img)
    print(f"Text from {sys.argv[1]}:")
    formatText(text)

else:

    print('Incorrect usage: .venv/bin/python3 extract.py [directory/image]')