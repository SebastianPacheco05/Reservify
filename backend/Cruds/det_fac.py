from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_det_fac(db: Session, descripcion: str, unidades: int, precio_unitario: float, precio_total: float, forma_pago: str, id_encab_fact: int):
    db.execute(
        text('SELECT insertar_detalle_factura(:descripcion, :unidades, :precio_unitario, :precio_total, :forma_pago, :id_encab_fact)'),
        {'descripcion': descripcion, 'unidades': unidades, 'precio_unitario': precio_unitario, 'precio_total': precio_total, 'forma_pago': forma_pago, 'id_encab_fact': id_encab_fact}
    )
    db.commit()

def editar_det_fac(db: Session, id_det_fact: int, descripcion: str, unidades: int, precio_unitario: float, precio_total: float, forma_pago: str, id_encab_fact: int):
    db.execute(
        text('SELECT editar_detalle_factura(:id_det_fact, :descripcion, :unidades, :precio_unitario, :precio_total, :forma_pago, :id_encab_fact)'),
        {'id_det_fact': id_det_fact, 'descripcion': descripcion, 'unidades': unidades, 'precio_unitario': precio_unitario, 'precio_total': precio_total, 'forma_pago': forma_pago, 'id_encab_fact': id_encab_fact}
    )
    db.commit()

def borrar_det_fac(db: Session, id_det_fact: int):
    db.execute(
        text('SELECT borrar_detalle_factura(:id_det_fact)'),
        {'id_det_fact': id_det_fact}
    )
    db.commit()