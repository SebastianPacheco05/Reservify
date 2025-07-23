from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/reservar")
async def reservar(request: Request):
    data = await request.json()
    restaurante = data.get("request", {}).get("intent", {}).get("slots", {}).get("restaurante", {}).get("value", "desconocido")

    # Aquí podrías insertar en tu base de datos PostgreSQL
    return JSONResponse({
        "version": "1.0",
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": f"He hecho tu reserva en {restaurante}"
            },
            "shouldEndSession": True
        }
    })
