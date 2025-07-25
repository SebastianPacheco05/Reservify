from sqlalchemy.orm import Session
from sqlalchemy import text


def obtener_rol(db: Session, id_rol: int):
    result = db.execute(
        text('SELECT nombre_rol, descripcion FROM "Roles" WHERE id_rol = :id_rol'),
        {"id_rol": id_rol},
    )
    row = result.fetchone()
    if row:
        return {"nombre_rol": row[0], "descripcion": row[1]}
    return None


def obtener_roles(db: Session):
    result = db.execute(text('SELECT id_rol, nombre_rol, descripcion FROM "Roles"'))
    rows = result.fetchall()
    return [
        {"id_rol": row[0], "nombre_rol": row[1], "descripcion": row[2]} for row in rows
    ]


def obtener_dueno(db: Session, documento: str):
    result = db.execute(
        text(
            'SELECT nombre, apellido, id_rol, id_credencial FROM "Dueno" WHERE documento = :documento'
        ),
        {"documento": documento},
    )
    row = result.fetchone()
    if row:
        return {
            "nombre": row[0],
            "apellido": row[1],
            "id_rol": row[2],
            "id_credencial": row[3],
        }
    return None


def obtener_duenos(db: Session):
    result = db.execute(
        text(
            'SELECT documento, nombre, apellido, id_rol, id_credencial FROM "Dueno"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "documento": row[0],
            "nombre": row[1],
            "apellido": row[2],
            "id_rol": row[4],
            "id_credencial": row[5],
        }
        for row in rows
    ]


def obtener_cliente(db: Session, documento: str):
    result = db.execute(
        text(
            'SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol FROM "Cliente" WHERE documento = :documento'
        ),
        {"documento": documento},
    )
    row = result.fetchone()
    if row:
        return {
            "id_credencial": row[0],
            "nombre": row[1],
            "apellido": row[2],
            "tipo_documento": row[3],
            "documento": row[4],
            "nacionalidad": row[5],
            "telefono": row[6],
            "id_rol": row[7],
        }
    return None


def obtener_clientes(db: Session):
    result = db.execute(
        text(
            'SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol FROM "Cliente"'
        )
    )
    rows = result.mappings().all()
    return [
        {
            "id_credencial": row["id_credencial"],
            "nombre": row["nombre"],
            "apellido": row["apellido"],
            "tipo_documento": row["tipo_documento"],
            "documento": row["documento"],
            "nacionalidad": row["nacionalidad"],
            "telefono": row["telefono"],
            "id_rol": row["id_rol"],
        }
        for row in rows
    ]



def obtener_empleado(db: Session, documento: str):
    result = db.execute(
        text(
            'SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, NIT FROM "Empleado" WHERE documento = :documento'
        ),
        {"documento": documento},
    )
    row = result.fetchone()
    if row:
        return {
            "id_credencial": row[0],
            "nombre": row[1],
            "apellido": row[2],
            "tipo_documento": row[3],
            "documento": row[4],
            "nacionalidad": row[5],
            "telefono": row[6],
            "id_rol": row[7],
            "NIT": row[8],
        }
    return None


def obtener_empleados(db: Session):
    result = db.execute(
        text(
            'SELECT id_credencial, nombre, apellido, tipo_documento, documento, nacionalidad, telefono, id_rol, NIT FROM "Empleado"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "id_credencial": row[0],
            "nombre": row[1],
            "apellido": row[2],
            "tipo_documento": row[3],
            "documento": row[4],
            "nacionalidad": row[5],
            "telefono": row[6],
            "id_rol": row[8],
            "NIT": row[9],
        }
        for row in rows
    ]


def obtener_restaurante(db: Session, nit: int):
    result = db.execute(
        text(
            'SELECT NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento FROM "Restaurante" WHERE nit = :nit'
        ),
        {"nit": nit},
    )
    row = result.fetchone()
    if row:
        return {
            "NIT": row[0],
            "direccion": row[1],
            "nombre_restaurante": row[2],
            "descripcion_restaurante": row[3],
            "horario_apertura": row[4],
            "horario_cierre": row[5],
            "documento": row[6],
        }
    return None


def obtener_restaurantes(db: Session):
    result = db.execute(
        text(
            'SELECT nit, NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, documento FROM "Restaurante"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "nit": row[0],
            "NIT": row[1],
            "direccion": row[2],
            "nombre_restaurante": row[3],
            "descripcion_restaurante": row[4],
            "horario_apertura": row[5],
            "horario_cierre": row[6],
            "documento": row[7],
        }
        for row in rows
    ]


def obtener_mesa(db: Session, id_mesa: int):
    result = db.execute(
        text(
            'SELECT estado_de_disponibilidad, cant_personas, NIT, precio FROM "Mesas" WHERE id_mesa = :id_mesa'
        ),
        {"id_mesa": id_mesa},
    )
    row = result.fetchone()
    if row:
        return {
            "estado_de_disponibilidad": row[0],
            "cant_personas": row[1],
            "NIT": row[2],
            "precio": row[3],
        }
    return None


def obtener_mesas(db: Session):
    result = db.execute(
        text(
            'SELECT id_mesa, estado_de_disponibilidad, cant_personas, NIT, precio FROM "Mesas"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "id_mesa": row[0],
            "estado_de_disponibilidad": row[1],
            "cant_personas": row[2],
            "NIT": row[3],
            "precio": row[4],
        }
        for row in rows
    ]


def obtener_encabezado_factura(db: Session, id_encab_fact: int):
    result = db.execute(
        text(
            'SELECT NIT, nombre_restaurante, direccion, ciudad, fecha FROM "Encabezado_factura" WHERE id_encab_fact = :id_encab_fact'
        ),
        {"id_encab_fact": id_encab_fact},
    )
    row = result.fetchone()
    if row:
        return {
            "NIT": row[0],
            "nombre_restaurante": row[1],
            "direccion": row[2],
            "ciudad": row[3],
            "fecha": row[4],
        }
    return None


def obtener_encabezados_factura(db: Session):
    result = db.execute(
        text(
            'SELECT id_encab_fact, NIT, nombre_restaurante, direccion, ciudad, fecha FROM "Encabezado_factura"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "id_encab_fact": row[0],
            "NIT": row[1],
            "nombre_restaurante": row[2],
            "direccion": row[3],
            "ciudad": row[4],
            "fecha": row[5],
        }
        for row in rows
    ]


def obtener_detalle_factura(db: Session, id_det_fact: int):
    result = db.execute(
        text(
            'SELECT descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact FROM "Detalle_factura" WHERE id_det_fact = :id_det_fact'
        ),
        {"id_det_fact": id_det_fact},
    )
    row = result.fetchone()
    if row:
        return {
            "descripcion": row[0],
            "unidades": row[1],
            "precio_unitario": row[2],
            "precio_total": row[3],
            "forma_pago": row[4],
            "id_encab_fact": row[5],
        }
    return None


def obtener_detalles_factura(db: Session):
    result = db.execute(
        text(
            'SELECT id_det_fact, descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact FROM "Detalle_factura"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "id_det_fact": row[0],
            "descripcion": row[1],
            "unidades": row[2],
            "precio_unitario": row[3],
            "precio_total": row[4],
            "forma_pago": row[5],
            "id_encab_fact": row[6],
        }
        for row in rows
    ]


def obtener_reserva(db: Session, id_reserva: int):
    result = db.execute(
        text(
            'SELECT id_mesa, id_encab_fact, horario, fecha FROM "Reserva" WHERE id_reserva = :id_reserva'
        ),
        {"id_reserva": id_reserva},
    )
    row = result.fetchone()
    if row:
        return {
            "id_mesa": row[0],
            "id_encab_fact": row[1],
            "horario": row[2],
            "fecha": row[3],
        }
    return None


def obtener_reservas(db: Session):
    result = db.execute(
        text(
            'SELECT id_reserva, id_mesa, id_encab_fact, horario, fecha FROM "Reserva"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "id_reserva": row[0],
            "id_mesa": row[1],
            "id_encab_fact": row[2],
            "horario": row[3],
            "fecha": row[4],
        }
        for row in rows
    ]


def obtener_categoria(db: Session, id_categoria: int):
    result = db.execute(
        text(
            'SELECT nombre_categoria FROM "Categorias" WHERE id_categoria = :id_categoria'
        ),
        {"id_categoria": id_categoria},
    )
    row = result.fetchone()
    if row:
        return {"nombre_categoria": row[0]}
    return None


def obtener_categorias(db: Session):
    result = db.execute(text('SELECT id_categoria, nombre_categoria FROM "Categorias"'))
    rows = result.fetchall()
    return [{"id_categoria": row[0], "nombre_categoria": row[1]} for row in rows]


def obtener_calculo_mensual(db: Session, id_calculo: int):
    result = db.execute(
        text(
            'SELECT nit, mes, anio, total_reservas, revenue, total_clientes FROM "Calculos_mensuales" WHERE id_calculo = :id_calculo'
        ),
        {"id_calculo": id_calculo},
    )
    row = result.fetchone()
    if row:
        return {
            "nit": row[0],
            "mes": row[1],
            "anio": row[2],
            "total_reservas": row[3],
            "revenue": row[4],
            "total_clientes": row[5],
        }
    return None


def obtener_calculos_mensuales(db: Session):
    result = db.execute(
        text(
            'SELECT id_calculo, nit, mes, anio, total_reservas, revenue, total_clientes FROM "Calculos_mensuales"'
        )
    )
    rows = result.fetchall()
    return [
        {
            "id_calculo": row[0],
            "nit": row[1],
            "mes": row[2],
            "anio": row[3],
            "total_reservas": row[4],
            "revenue": row[5],
            "total_clientes": row[6],
        }
        for row in rows
    ]


def obtener_comentarios(db: Session):
    result = db.execute(text('SELECT id_comentario, comentario FROM "Comentarios"'))
    rows = result.fetchall()
    return [{"id_comentario": row[0], "comentario": row[1]} for row in rows]


def obtener_comentario(db: Session, id_comentario: int):
    result = db.execute(
        text(
            'SELECT comentario FROM "Comentarios" WHERE id_comentario = :id_comentario'
        ),
        {"id_comentario": id_comentario},
    )
