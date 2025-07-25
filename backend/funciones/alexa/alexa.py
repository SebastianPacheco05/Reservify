from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

load_dotenv()  # Carga las variables del archivo .env

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/reservar")
async def reservar(request: Request, db: Session = Depends(get_db)):
    body = await request.json()

    restaurante = body.get("request", {}).get("intent", {}).get("slots", {}).get("restaurante", {}).get("value", None)

    if restaurante:
        db.execute(text("INSERT INTO restaurante (nombre) VALUES (:nombre)"), {"nombre": restaurante})
        db.commit()

        return JSONResponse({
            "version": "1.0",
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": f"Tu reserva en {restaurante} ha sido registrada correctamente."
                },
                "shouldEndSession": True
            }
        })
    else:
        return JSONResponse({
            "version": "1.0",
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "No entendí el nombre del restaurante. Por favor intenta de nuevo."
                },
                "shouldEndSession": False
            }
        })
