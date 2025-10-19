from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from models import Item, CreatePreferenceRequest, PreferenceResponse
from config import get_db
from funciones.mercado_pago.mercado_pago import save_pending_payment, update_payment_status, create_preference_on_mp, mp_sdk

router = APIRouter(
    prefix="/mercadopago",
    tags=["MercadoPago"]
)

@router.post("/create_preference", response_model=PreferenceResponse)
def create_preference(req: CreatePreferenceRequest, db: Session = Depends(get_db)):
    try:
        items_list = [{"title": i.title, "quantity": i.quantity, "unit_price": i.unit_price} for i in req.items]

        # Unificar external_reference: id_encab_fact_id_reserva
        external_reference = f"{req.id_encab_fact}_{req.id_reserva}"

        pref = create_preference_on_mp(items_list, external_reference)

        if not pref or "id" not in pref:
            raise HTTPException(status_code=500, detail="No se recibió el 'id' de la preferencia de Mercado Pago")

        # Calcular monto total
        amount = sum(i.quantity * i.unit_price for i in req.items)

        save_pending_payment(
            db,
            req.id_encab_fact,
            req.id_reserva,
            req.cliente_documento,
            req.NIT,
            pref["id"],
            amount
        )

        return PreferenceResponse(
            id=pref["id"],
            init_point=pref.get("init_point"),
            sandbox_init_point=pref.get("sandbox_init_point")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creando preferencia: {e}")

@router.post("/webhook")
async def mp_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    payment_id = body.get("id")

    if not payment_id:
        return {"status": "no payment id"}

    try:
        payment = mp_sdk.payment().get(payment_id)["response"]
        estado = payment.get("status")
        monto = payment.get("transaction_amount")
        external_ref = str(payment.get("external_reference"))

        update_payment_status(db, external_ref, estado, monto)

        return {"status": "ok", "payment_status": estado}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
