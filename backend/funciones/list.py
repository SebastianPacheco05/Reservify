from sqlalchemy.orm import Session
from sqlalchemy import text


def obtener_credenciales(db: Session, id_credencial: int):
    result = db.execute(
        text('SELECT email, password FROM "Credenciales" WHERE id_credencial = :id_credencial'),
        {"id_credencial": id_credencial},
    )
    row = result.fetchone()
    if row:
        return {"email": row[0], "password": row[1]}
    return None

def obtener_roles(db: Session, id_rol: int):
    result = db.execute(
        text('SELECT nombre_rol, descripcion FROM "Roles" WHERE id_rol = :id_rol'),
        {"id_rol": id_rol},
    )
    row = result.fetchone()
    if row:
        return {"nombre_rol": row[0], "descripcion": row[1]}
    return None

def obtener_duenos(db: Session, id_dueno: int):
    result = db.execute(
        text('SELECT nombre1, nombre2, apellido1, apellido2, id_rol, id_credencial FROM "Dueno" WHERE id_dueno = :id_dueno'),
        {"id_dueno": id_dueno},
    )
    row = result.fetchone()
    if row:
        return {"nombre1": row[0], "nombre2": row[1], "apellido1": row[2], "apellido2": row[3], "id_rol": row[4], "id_credencial": row[5]}
    return None

def obtener_clientes(db: Session, id_cliente: int):
    result = db.execute(
        text('SELECT id_credencial, nombre1, nombre2, apellido1, apellido2, tipo_documento, documento, nacionalidad, telefono, id_rol FROM "Cliente" WHERE id_cliente = :id_cliente'),
        {"id_cliente": id_cliente},
    )
    row = result.fetchone()
    if row:
        return {"id_credencial": row[0], "nombre1": row[1], "nombre2": row[2], "apellido1": row[3], "apellido2": row[4], "tipo_documento": row[5], "documento": row[6], "nacionalidad": row[7], "telefono": row[8], "id_rol": row[9]}
    return None

def obtener_empleados(db: Session, id_empleado: int):
    result = db.execute(
        text('SELECT id_credencial, nombre1, nombre2, apellido1, apellido2, tipo_documento, documento, nacionalidad, telefono, id_rol, NIT FROM "Empleado" WHERE id_empleado = :id_empleado'),
        {"id_empleado": id_empleado},
    )
    row = result.fetchone()
    if row:
        return {"id_credencial": row[0], "nombre1": row[1], "nombre2": row[2], "apellido1": row[3], "apellido2": row[4], "tipo_documento": row[5], "documento": row[6], "nacionalidad": row[7], "telefono": row[8], "id_rol": row[9], "NIT": row[10]}
    return None

def obtener_restaurantes(db: Session, id_restaurante: int):
    result = db.execute(
        text('SELECT NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, id_dueno FROM "Restaurante" WHERE id_restaurante = :id_restaurante'),
        {"id_restaurante": id_restaurante},
    )
    row = result.fetchone()
    if row:
        return {"NIT": row[0], "direccion": row[1], "nombre_restaurante": row[2], "descripcion_restaurante": row[3], "horario_apertura": row[4], "horario_cierre": row[5], "id_dueno": row[6]}
    return None

def obtener_mesas(db: Session, id_mesa: int):
    result = db.execute(
        text('SELECT estado_de_disponibilidad, cant_personas, NIT, precio FROM "Mesas" WHERE id_mesa = :id_mesa'),
        {"id_mesa": id_mesa},
    )
    row = result.fetchone()
    if row:
        return {"estado_de_disponibilidad": row[0], "cant_personas": row[1], "NIT": row[2], "precio": row[3]}
    return None

def obtener_encabezado_factura(db: Session, id_encab_fact: int):
    result = db.execute(
        text('SELECT NIT, nombre_restaurante, direccion, ciudad, fecha, id_cliente FROM "Encabezado_factura" WHERE id_encab_fact = :id_encab_fact'),
        {"id_encab_fact": id_encab_fact},
    )
    row = result.fetchone()
    if row:
        return {"NIT": row[0], "nombre_restaurante": row[1], "direccion": row[2], "ciudad": row[3], "fecha": row[4], "id_cliente": row[5]}
    return None

def obtener_detalle_factura(db: Session, id_det_fact: int):
    result = db.execute(
        text('SELECT descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact FROM "Detalle_factura" WHERE id_det_fact = :id_det_fact'),
        {"id_det_fact": id_det_fact},
    )
    row = result.fetchone()
    if row:
        return {"descripcion": row[0], "unidades": row[1], "precio_unitario": row[2], "precio_total": row[3], "forma_pago": row[4], "id_encab_fact": row[5]}
    return None

def obtener_reservas(db: Session, id_reserva: int):
    result = db.execute(
        text('SELECT id_mesa, id_cliente, id_encab_fact, horario, fecha FROM "Reserva" WHERE id_reserva = :id_reserva'),
        {"id_reserva": id_reserva},
    )
    row = result.fetchone()
    if row:
        return {"id_mesa": row[0], "id_cliente": row[1], "id_encab_fact": row[2], "horario": row[3], "fecha": row[4]}
    return None




