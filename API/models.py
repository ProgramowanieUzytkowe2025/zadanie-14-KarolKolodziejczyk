from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Herbata(Base):
    __tablename__ = "herbaty"

    id = Column(Integer, primary_key=True, index=True)
    nazwa = Column(String, nullable=False)
    cena = Column(Float, nullable=False)
    dostepne = Column(Boolean, default=True)