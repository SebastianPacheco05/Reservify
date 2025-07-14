from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from config import get_db
from funciones.cruds import (
    credenciales,
    roles,
    dueno,
    restaurante,
    mesas,
    cliente,
    empleado,
    enc_fac,
    det_fac,
    reserva,
    list,
    categorias,
    cal_mensuales,
    comentarios,
)
from models import *

from funciones.auth.dependencies import verificar_token
from funciones.auth.login import login_usuario
from funciones.email_sender.email_utils import send_email
from funciones.email_sender.timer_reserv import tarea_programada

app = FastAPI()

protected_router = APIRouter(
    # prefix="/admin",  # opcional
    dependencies=[Depends(verificar_token)]
)

app.include_router(protected_router)


# Permitir CORS desde frontend (localhost:5173 por defecto en Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Credenciales


@app.post("/insertarcredencial")
async def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)


@app.post("/login")
def login(input: login, request: Request, db: Session = Depends(get_db)):
    return login_usuario(db, input.email, input.password, request)




@app.get("/perfil")
def perfil(usuario: dict = Depends(verificar_token)):
    return {"usuario": usuario}


@protected_router.get("/listar_credenciales")
async def listar_credenciales(db: Session = Depends(get_db)):
    respuesta = list.obtener_credenciales(db)
    return {"respuesta": respuesta}


@app.put("/editarcredencial")
async def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)


@app.delete("/borrarcredencial")
async def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)


# Roles


@protected_router.post("/insertaroles")
async def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.nombre_rol, data.descripcion)


@app.get("/listar_rol")
async def listar_rol(data: ListarRoles, db: Session = Depends(get_db)):
    respuesta = list.obtener_rol(db, data.id_rol)
    return {"respuesta": respuesta}


@protected_router.get("/listar_roles")
async def listar_roles(db: Session = Depends(get_db)):
    respuesta = list.obtener_roles(db)
    return {"respuesta": respuesta}


@app.put("/editaroles")
async def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)


@app.delete("/borraroles")
async def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)


# Dueno


@app.post("/insertardueno")
async def insertar(data: DuenoBase, db: Session = Depends(get_db)):
    dueno.insertar_dueno(
        db,
        data.nombre,
        data.apellido,
        data.id_rol,
        data.id_credencial,
    )


@app.get("/listar_dueno")
async def listar_dueno(data: ListarDuenos, db: Session = Depends(get_db)):
    respuesta = list.obtener_dueno(db, data.documento)
    return {"respuesta": respuesta}


@app.get("/listar_duenos")
async def listar_duenos(db: Session = Depends(get_db)):
    respuesta = list.obtener_duenos(db)
    return {"respuesta": respuesta}


@app.put("/editardueno")
async def editar(data: DuenoUpdate, db: Session = Depends(get_db)):
    dueno.editar_dueno(
        db,
        data.documento,
        data.nombre,
        data.apellido,
        data.id_rol,
        data.id_credencial,
    )


@app.delete("/borrardueno")
async def borrar(data: DuenoDelete, db: Session = Depends(get_db)):
    dueno.borrar_dueno(db, data.documento)


# Restaurante


@app.post("/insertarrestaurante")
async def insertar(data: RestauranteBase, db: Session = Depends(get_db)):
    restaurante.insertar_restaurante(
        db,
        data.NIT,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.documento,
    )


@app.get("/listar_restaurante")
async def listar_restaurante(data: ListarRestaurantes, db: Session = Depends(get_db)):
    respuesta = list.obtener_restaurante(db, data.nit)
    return {"respuesta": respuesta}


@app.get("/listar_restaurantes")
async def listar_restaurantes(db: Session = Depends(get_db)):
    respuesta = list.obtener_restaurantes(db)
    return {"respuesta": respuesta}


@app.put("/editarrestaurante")
async def editar(data: RestauranteUpdate, db: Session = Depends(get_db)):
    restaurante.editar_restaurante(
        db,
        data.NIT,
        data.direccion,
        data.nombre_restaurante,
        data.descripcion_restaurante,
        data.horario_apertura,
        data.horario_cierre,
        data.documento,
    )


@app.delete("/borrarrestaurante")
async def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.nit)


# Mesas


@app.post("/insertarmesas")
async def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(
        db, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio
    )


@app.get("/listar_mesa")
async def listar_mesa(data: ListarMesas, db: Session = Depends(get_db)):
    respuesta = list.obtener_mesa(db, data.id_mesa)
    return {"respuesta": respuesta}


@app.get("/listar_mesas")
async def listar_mesas(db: Session = Depends(get_db)):
    respuesta = list.obtener_mesas(db)
    return {"respuesta": respuesta}


@app.put("/editarmesas")
async def editar(data: MesaUpdate, db: Session = Depends(get_db)):
    mesas.editar_mesas(
        db,
        data.id_mesa,
        data.estado_de_disponibilidad,
        data.cant_personas,
        data.NIT,
        data.precio,
    )


@app.delete("/borrarmesas")
async def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)


# Cliente


@app.post("/insertarcliente")
async def insertar(data: ClienteBase, db: Session = Depends(get_db)):
    cliente.insertar_clientes(
        db,
        data.id_credencial,
        data.nombre,

        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
    )


@app.get("/listar_cliente")
async def listar_cliente(
    data: ListarClientes,
    db: Session = Depends(get_db),
):
    respuesta = list.obtener_cliente(db, data.documento)
    return {"respuesta": respuesta}


@app.get("/listar_clientes")
async def listar_clientes(db: Session = Depends(get_db)):
    respuesta = list.obtener_clientes(db)
    return {"respuesta": respuesta}


@app.put("/editarcliente")
async def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
    cliente.editar_clientes(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
    )


@app.delete("/borrarcliente")
async def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    cliente.borrar_clientes(db, data.documento)


# Empleado


@app.post("/insertarempleado")
async def insertar(data: EmpleadoBase, db: Session = Depends(get_db)):
    empleado.insertar_empleado(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        data.NIT,
    )


@app.get("/listar_empleado")
async def listar_empleado(data: ListarEmpleados, db: Session = Depends(get_db)):
    respuesta = list.obtener_empleado(db, data.documento)
    return {"respuesta": respuesta}


@app.get("/listar_empleados")
async def listar_empleados(db: Session = Depends(get_db)):
    respuesta = list.obtener_empleados(db)
    return {"respuesta": respuesta}


@app.put("/editarempleado")
async def editar(data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado.editar_empleado(
        db,
        data.id_credencial,
        data.nombre,
        data.apellido,
        data.tipo_documento,
        data.documento,
        data.nacionalidad,
        data.telefono,
        data.id_rol,
        data.NIT,
    )


@app.delete("/borrarempleado")
async def borrar(data: EmpleadoDelete, db: Session = Depends(get_db)):
    empleado.borrar_empleado(db, data.documento)


# Encabezado_factura


@app.post("/insertarencabezadofactura")
async def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db)):
    enc_fac.insertar_enc_fac(
        db,
        data.NIT,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.documento,
    )


@app.get("/listar_encabezado_factura")
async def listar_encabezado_factura(
    data: ListarEncabezadoFactura, db: Session = Depends(get_db)
):
    respuesta = list.obtener_encabezado_factura(db, data.id_encab_fact)
    return {"respuesta": respuesta}


@app.get("/listar_encabezados_factura")
async def listar_encabezados_factura(db: Session = Depends(get_db)):
    respuesta = list.obtener_encabezados_factura(db)
    return {"respuesta": respuesta}


@app.put("/editarencabezadofactura")
async def editar(data: Encabezado_facturaUpdate, db: Session = Depends(get_db)):
    enc_fac.editar_enc_fac(
        db,
        data.id_encab_fact,
        data.NIT,
        data.nombre_restaurante,
        data.direccion,
        data.ciudad,
        data.fecha,
        data.documento,
    )


@app.delete("/borrarencabezadofactura")
async def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)


# Detalle_factura


@app.post("/insertardetallefactura")
async def insertar(data: Detalle_facturaBase, db: Session = Depends(get_db)):
    det_fac.insertar_det_fac(
        db,
        data.descripcion,
        data.unidades,
        data.precio_unitario,
        data.precio_total,
        data.forma_pago,
        data.id_encab_fact,
    )


@app.get("/listar_detalle_factura")
async def listar_detalle_factura(
    data: ListarDetalleFactura, db: Session = Depends(get_db)
):
    respuesta = list.obtener_detalle_factura(db, data.id_det_fact)
    return {"respuesta": respuesta}


@app.get("/listar_detalles_factura")
async def listar_detalles_factura(db: Session = Depends(get_db)):
    respuesta = list.obtener_detalles_factura(db)
    return {"respuesta": respuesta}


@app.put("/editardetallefactura")
async def editar(data: Detalle_facturaUpdate, db: Session = Depends(get_db)):
    det_fac.editar_det_fac(
        db,
        data.id_det_fact,
        data.descripcion,
        data.unidades,
        data.precio_unitario,
        data.precio_total,
        data.forma_pago,
        data.id_encab_fact,
    )


@app.delete("/borrardetallefactura")
async def borrar(data: Detalle_facturaDelete, db: Session = Depends(get_db)):
    det_fac.borrar_det_fac(db, data.id_det_fact)


# Reserva


@app.post("/insertarreserva")
async def insertar(data: ReservaBase, db: Session = Depends(get_db)):
    reserva.insertar_reserva(
        db, data.id_mesa, data.documento, data.id_encab_fact, data.horario, data.fecha
    )


@app.get("/listar_reserva")
async def listar_reserva(data: ListarReservas, db: Session = Depends(get_db)):
    respuesta = list.obtener_reserva(db, data.id_reserva)
    return {"respuesta": respuesta}


@app.get("/listar_reservas")
async def listar_reservas(db: Session = Depends(get_db)):
    respuesta = list.obtener_reservas(db)
    return {"respuesta": respuesta}


@app.put("/editarreserva")
async def editar(data: ReservaUpdate, db: Session = Depends(get_db)):
    reserva.editar_reserva(
        db,
        data.id_reserva,
        data.id_mesa,
        data.documento,
        data.id_encab_fact,
        data.horario,
        data.fecha,
    )


@app.delete("/borrarreserva")
async def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)


# Categorias


@app.post("/insertarcategoria")
async def insertar(data: insertarCategorias, db: Session = Depends(get_db)):
    categorias.insertar_categoria(db, data.nombre_categoria)


@app.get("/listar_categoria")
async def listar_categoria(data: ListarCategorias, db: Session = Depends(get_db)):
    respuesta = list.obtener_categoria(db, data.id_categoria)
    return {"respuesta": respuesta}


@app.get("/listar_categorias")
async def listar_categorias(db: Session = Depends(get_db)):
    respuesta = list.obtener_categorias(db)
    return {"respuesta": respuesta}


@app.put("/editarcategoria")
async def editar(data: editarCategorias, db: Session = Depends(get_db)):
    categorias.editar_categoria(db, data.id_categoria, data.nombre_categoria)


@app.delete("/borrar_categoria")
async def borrar(data: borrarCategorias, db: Session = Depends(get_db)):
    categorias.borrar_categoria(db, data.id_categoria)


# Contactanos


@app.post("/contactanos")
async def enviar_correo(data: EmailSchema):
    enviado = send_email(data.to, data.subject, data.message)
    if enviado:
        return {"mensaje": "Correo enviado correctamente"}
    else:
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo")


# Tarea programada para enviar correos cada minuto
@app.on_event("startup")
async def startup_event():
    import asyncio

    asyncio.create_task(tarea_programada())


# Calculos Mensuales


@app.post("/insertar_calculo_mensual")
async def insertar(data: CalculoMensualBase, db: Session = Depends(get_db)):
    cal_mensuales.insertar_calculo_mensual(
        db,
        data.nit,
        data.mes,
        data.anio,
        data.total_reservas,
        data.revenue,
        data.total_clientes,
    )


@app.put("/editar_calculo_mensual")
async def editar(data: CalculoMensualUpdate, db: Session = Depends(get_db)):
    cal_mensuales.editar_calculo_mensual(
        db,
        data.id_calculo,
        data.nit,
        data.mes,
        data.anio,
        data.total_reservas,
        data.revenue,
        data.total_clientes,
    )


@app.delete("/borrar_calculo_mensual")
async def borrar(data: CalculoMensualDelete, db: Session = Depends(get_db)):
    cal_mensuales.borrar_calculo_mensual(db, data.id_calculo)


@app.get("/listar_calculo_mensual")
async def listar_calculo_mensual(
    data: ListarCalculoMensual, db: Session = Depends(get_db)
):
    respuesta = list.obtener_calculo_mensual(db, data.id_calculo)
    return {"respuesta": respuesta}


@app.get("/listar_calculos_mensuales")
async def listar_calculos_mensuales(db: Session = Depends(get_db)):
    respuesta = list.obtener_calculos_mensuales(db)
    return {"respuesta": respuesta}


# Comentarios


@app.post("/insertarcomentario")
async def insertar(data: ComentarioBase, db: Session = Depends(get_db)):
    comentarios.insertar_comentario(db, data.documento, data.nit, data.comentario)


@app.put("/editarcomentario")
async def editar(data: ComentarioUpdate, db: Session = Depends(get_db)):
    comentarios.editar_comentario(db, data.id_comentario, data.comentario)


@app.delete("/borrarcomentario")
async def borrar(data: ComentarioDelete, db: Session = Depends(get_db)):
    comentarios.borrar_comentario(db, data.id_comentario)


@app.get("/listar_comentario")
async def listar_comentario(data: ListarComentarios, db: Session = Depends(get_db)):
    respuesta = list.obtener_comentario(db, data.id_comentario)
    return {"respuesta": respuesta}


@app.get("/listar_comentarios")
async def listar_comentarios(db: Session = Depends(get_db)):
    respuesta = list.obtener_comentarios(db)
    return {"respuesta": respuesta}
