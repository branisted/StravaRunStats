from sqlalchemy import Column, Integer, String
from database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True, unique=True)
    distance = Column(String)
    time = Column(String)
    pace = Column(Integer)