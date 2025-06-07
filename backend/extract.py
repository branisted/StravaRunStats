import os
import pathlib
import re
from PIL import Image
import pytesseract
import numpy as np
import asyncio
import json
import cv2

pytesseract_config = 'lang=ron'

def preprocess(imgPath: str):

    img = Image.open(imgPath).convert('L')

    # converting the image in numpy array
    img_np = np.array(img)

    # threshold value (180-220)
    threshold = 190
    binary = (img_np > threshold) * 255
    binary = binary.astype(np.uint8)

    # turning the image back in the array
    img = np.array(Image.fromarray(binary))

    # cropping
    height = img.shape[0]
    width = img.shape[1]
    cropped = img[int(0.66 * height):height, 0:width - 1]

    #temp
    # Image.fromarray(cropped).save('imgmodified.jpeg')

    return cropped



def fix_date_spacing(text):
    # List of Romanian months
    months = [
        "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", 
        "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"
    ]
    # Regex: digit(s) directly followed by a month name
    pattern = r'(\d{1,2})(' + '|'.join(months) + r')'
    # Insert space between digit(s) and month
    fixed_text = re.sub(pattern, r'\1 \2', text, flags=re.IGNORECASE)
    return fixed_text



def fix_text_ocr(text: str):

    # Correct OCR mistake where "1 iunie" becomes "Liunie"
    # We target cases where the line starts with a capital L followed by lowercase letters

    lines = text.splitlines()
    fixed_lines = []

    for line in lines:
        # Try to fix a month line that starts with "L" instead of "1"
        if re.match(r'^L[a-z]+ \d{4}', line):
            # Replace only the first character with "1 "
            line = '1 ' + line[1:]
        fixed_lines.append(line)

    return '\n'.join(fixed_lines)



def format_text_json(text: str):

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
    distance = dist_match.group(0).replace(" ", "") if dist_match else "Not found"

    time_match = re.search(r'(\d+\s?m\s?\d+\s?s)', text)
    time = time_match.group(1).replace(" ", "") if time_match else "Not found"

    pace_match = re.search(r'(\d+:\d+)\s*/\s?km', text)
    pace = f"{pace_match.group(1)}/km" if pace_match else "Not found"

    result = {
        "date": formatted_date,
        "distance": distance,
        "time": time,
        "pace": pace
    }

    return result



async def extract_text(usedPath: str):

    if (os.path.isdir(usedPath) == True):

        files = [f for f in pathlib.Path(usedPath).iterdir() if f.is_file()]
        text = ""

        for f in files:

            text = text + f"Text from {f.name}:" + "\n"
            img = preprocess(f)
            tmp = pytesseract.image_to_string(img)
            tmp = fix_date_spacing(tmp)
            tmp = fix_text_ocr(tmp)
            # print(tmp)
            text = text + str(format_text_json(tmp)) + "\n"
            
        return text

    elif (os.path.isfile(usedPath) == True):

        if ((pathlib.Path(usedPath).suffix) not in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tif', '.tiff', '.heic', '.heif', '.apng', '.ico']):
            print('Image extension not accepted.')
            exit

        img = preprocess(usedPath)
        text = pytesseract.image_to_string(img)
        # text = pytesseract.image_to_string(usedPath)
        text = fix_date_spacing(text)
        text = fix_text_ocr(text)
        
        return format_text_json(text)
        #return text

    else:

        print('Incorrect usage: extractTextFromImage(directory/image)')

        return "No text found."
    
    return