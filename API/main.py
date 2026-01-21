from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from database import engine
import random
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import time
from fastapi import Query

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Herbaty")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HerbataSchema(BaseModel):
    nazwa: str
    cena: float
    dostepne: bool

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def add_random_herbata(db: Session):
    nazwy = ["Zielona", "Czarna", "Biała", "Oolong", "Assam", "Earl Grey", "Rooibos"]
    while db.query(models.Herbata).count() < 5:
        herbata = models.Herbata(
            nazwa=random.choice(nazwy),
            cena=round(random.uniform(10, 20), 2),
            dostepne=random.choice([True, False])
        )
        db.add(herbata)
        db.commit()
        db.refresh(herbata)

with SessionLocal() as db:
    add_random_herbata(db)

# POST z JSON body
@app.post("/herbaty/")
def create_herbata(herbata: HerbataSchema, db: Session = Depends(get_db)):
    
    db_herbata = models.Herbata(
        nazwa=herbata.nazwa,
        cena=herbata.cena,
        dostepne=herbata.dostepne
    )
    if herbata.cena < 0:
        raise HTTPException(status_code=400, detail="Cena nie może być ujemna")
    db.add(db_herbata)
    db.commit()
    db.refresh(db_herbata)
    return {"id": db_herbata.id}

# GET wszystkie herbaty
@app.get("/herbaty/")
def read_all(dostepne: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.Herbata)
    if dostepne is not None:
        query = query.filter(models.Herbata.dostepne == dostepne)
    return query.all()

# GET jedna herbata
@app.get("/herbaty/{herbata_id}")
def read_one(herbata_id: int, db: Session = Depends(get_db)):
    herbata = db.query(models.Herbata).filter(models.Herbata.id == herbata_id).first()
    if herbata is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono")
    return herbata

# PUT z JSON body
@app.put("/herbaty/{herbata_id}")
def update_herbata(herbata_id: int, herbata: HerbataSchema, db: Session = Depends(get_db)):
    db_herbata = db.query(models.Herbata).filter(models.Herbata.id == herbata_id).first()
    if db_herbata is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono")
    if herbata.cena < 0:
        raise HTTPException(status_code=400, detail="Cena nie może być ujemna")
    db_herbata.nazwa = herbata.nazwa
    db_herbata.cena = herbata.cena
    db_herbata.dostepne = herbata.dostepne

    db.commit()
    db.refresh(db_herbata)
    return db_herbata

@app.get("/herbatySlow/")
def read_all_slow(dostepne: Optional[bool] = None, db: Session = Depends(get_db)):
    time.sleep(3)  
    query = db.query(models.Herbata)
    if dostepne is not None:
        query = query.filter(models.Herbata.dostepne == dostepne)
    return query.all()

# DELETE
@app.delete("/herbaty/{herbata_id}")
def delete_herbata(herbata_id: int, db: Session = Depends(get_db)):
    db_herbata = db.query(models.Herbata).filter(models.Herbata.id == herbata_id).first()
    if db_herbata is None:
        raise HTTPException(status_code=404, detail="Nie znaleziono")

    # 🔒 blokada: nie usuwamy, jeśli dostepne == False
    if db_herbata.dostepne == False:
        raise HTTPException(status_code=400, detail="Nie można usunąć niedostępnej herbaty")

    db.delete(db_herbata)
    db.commit()
    return {"status": "deleted"}
