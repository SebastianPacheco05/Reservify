from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config import get_db
from functions.top.top import obtener_top_restaurantes, obtener_restaurantes_paginados

app = APIRouter()

@app.get("/top")
async def get_top_restaurantes(db: Session = Depends(get_db)):
    return obtener_top_restaurantes(db)


@app.get("/top/paginado")
async def get_restaurantes_paginados(
    q: str = Query(default=""),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=30, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return obtener_restaurantes_paginados(
        db,
        query=q,
        page=page,
        per_page=per_page,
    )