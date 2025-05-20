from sqlalchemy.orm import Session
from sqlalchemy import text

def insertar_clientes(db: Session, id_credencial: int, nombre1: str, nombre2: str, apellido1: str, apellido2: str, tipo_documento: str, documento: int, nacionalidad: str, telefono: str, id_rol: int):
    db.execute(
        text('SELECT insertar_clientes(:id_credencial, :nombre1, :nombre2, :apellido1, :apellido2, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol)'),
        {'id_credencial': id_credencial, 'nombre1': nombre1, 'nombre2': nombre2, 'apellido1': apellido1, 'apellido2': apellido2, 'tipo_documento': tipo_documento, 'documento': documento, 'nacionalidad': nacionalidad, 'telefono': telefono, 'id_rol': id_rol}
    )
    db.commit()

def editar_clientes(db: Session, id_cliente: int, id_credencial: int, nombre1: str, nombre2: str, apellido1: str, apellido2: str, tipo_documento: str, documento: int, nacionalidad: str, telefono: str, id_rol: int):
    db.execute(
        text('SELECT editar_clientes(:id_cliente, :id_credencial, :nombre1, :nombre2, :apellido1, :apellido2, :tipo_documento, :documento, :nacionalidad, :telefono, :id_rol)'),
        {'id_cliente': id_cliente, 'id_credencial': id_credencial, 'nombre1': nombre1, 'nombre2': nombre2, 'apellido1': apellido1, 'apellido2': apellido2, 'tipo_documento': tipo_documento, 'documento': documento, 'nacionalidad': nacionalidad, 'telefono': telefono, 'id_rol': id_rol}
    )
    db.commit()

def borrar_clientes(db: Session, id_cliente: int):
    db.execute(
        text('SELECT borrar_clientes(:id_cliente)'),
        {'id_cliente': id_cliente}
    )
    db.commit()
