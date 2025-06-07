# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid

import platform

if platform.system() == "Windows":
    from extract_win import extract_text
else:
    from extract import extract_text

from crud import save_activity, get_all_activities
from database import SessionLocal, engine, Base
from models import Activity
import os
import uvicorn

from pydantic import BaseModel

class ExtractRequest(BaseModel):
    file_name: str

# import logging
#
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

app = FastAPI()

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

Base.metadata.create_all(bind=engine)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    file_id = f"{uuid.uuid4()}.jpeg"
    file_path = os.path.join(UPLOAD_DIR, file_id)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"file_path": file_path.replace(os.sep, "/")}

@app.post("/extract")
async def extract_data(request: ExtractRequest):
    data = await extract_text(request.file_name)
    return data

@app.post("/save")
async def save_data(data: dict):
    db = SessionLocal()
    activity = save_activity(db, data)
    return {"status": "success", "id": activity.id}

@app.get("/data")
async def read_all():
    db = SessionLocal()
    return get_all_activities(db)

if __name__ == "__main__":
    uvicorn.run(app, port=8000)