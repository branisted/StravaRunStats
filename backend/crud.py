from models import Activity
from sqlalchemy.orm import Session

def save_activity(db: Session, data: dict):
    activity = Activity(
        date=data.get("date", "Unknown"),
        distance=data.get("distance", "Unknown"),
        time=data.get("time", "Unknown"),
        pace=data.get("pace", "Unknown"),
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def get_all_activities(db: Session):
    return db.query(Activity).all()