from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from config import SessionLocal
from Cruds import credenciales, roles, dueno, restaurante, mesas, cliente, empleado, enc_fac, det_fac, reserva

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Credenciales
class CredencialBase(BaseModel):
    email: str
    password: str

class CredencialUpdate(CredencialBase):
    id_credencial: int

class CredencialDelete(BaseModel):
    id_credencial: int
    

@app.post("/insertarcredencial")
def insertar(data: CredencialBase, db: Session = Depends(get_db)):
    credenciales.insertar_credenciales(db, data.email, data.password)
    return {"message": "Credenciales insertadas correctamente"}

@app.post("/editarcredencial")
def editar(data: CredencialUpdate, db: Session = Depends(get_db)):
    credenciales.editar_credenciales(db, data.id_credencial, data.email, data.password)
    return {"message": "Credenciales actualizadas correctamente"}

@app.post("/borrarcredencial")
def borrar(data: CredencialDelete, db: Session = Depends(get_db)):
    credenciales.borrar_credenciales(db, data.id_credencial)
    return {"message": "Credenciales eliminadas correctamente"}

#Roles
class RolBase(BaseModel):
    nombre_rol: str
    descripcion: str

class RolUpdate(RolBase):
    id_rol: int

class RolDelete(BaseModel):
    id_rol: int
    

@app.post("/insertaroles")
def insertar(data: RolBase, db: Session = Depends(get_db)):
    roles.insertar_roles(db, data.nombre_rol, data.descripcion)
    return {"message": "Roles insertados correctamente"}

@app.post("/editaroles")
def editar(data: RolUpdate, db: Session = Depends(get_db)):
    roles.editar_roles(db, data.id_rol, data.nombre_rol, data.descripcion)
    return {"message": "Roles actualizados correctamente"}

@app.post("/borraroles")
def borrar(data: RolDelete, db: Session = Depends(get_db)):
    roles.borrar_roles(db, data.id_rol)
    return {"message": "Roles eliminados correctamente"}

#Dueno
class DuenoBase(BaseModel):
    nombre1: str
    nombre2: str
    apellido1: str
    apellido2: str
    id_rol: int
    id_credencial: int

class DuenoUpdate(DuenoBase):
    id_dueno: int

class DuenoDelete(BaseModel):
    id_dueno: int

@app.post("/insertardueno")
def insertar(data: DuenoBase, db: Session = Depends(get_db)):
    dueno.insertar_dueno(db, data.nombre1, data.nombre2, data.apellido1, data.apellido2, data.id_rol, data.id_credencial)
    return {"message": "Dueno insertado correctamente"}

@app.post("/editardueno")
def editar(data: DuenoUpdate, db: Session = Depends(get_db)):
    dueno.editar_dueno(db, data.id_dueno, data.nombre1, data.nombre2, data.apellido1, data.apellido2, data.id_rol, data.id_credencial)
    return {"message": "Dueno actualizado correctamente"}   

@app.post("/borrardueno")
def borrar(data: DuenoDelete, db: Session = Depends(get_db)):
    dueno.borrar_dueno(db, data.id_dueno)
    return {"message": "Dueno eliminado correctamente"}

#Restaurante
class RestauranteBase(BaseModel):
    direccion: str
    nombre_restaurante: str
    descripcion_restaurante: str
    horario_apertura: str   
    horario_cierre: str
    id_dueno: int

class RestauranteUpdate(RestauranteBase):
    id_restaurante: int 

class RestauranteDelete(BaseModel):
    id_restaurante: int

@app.post("/insertarrestaurante")
def insertar(data: RestauranteBase, db: Session = Depends(get_db)):
    restaurante.insertar_restaurante(db, data.direccion, data.nombre_restaurante, data.descripcion_restaurante, data.horario_apertura, data.horario_cierre, data.id_dueno)
    return {"message": "Restaurante insertado correctamente"}   

@app.post("/editarrestaurante")
def editar(data: RestauranteUpdate, db: Session = Depends(get_db)):
    restaurante.editar_restaurante(db, data.id_restaurante, data.direccion, data.nombre_restaurante, data.descripcion_restaurante, data.horario_apertura, data.horario_cierre, data.id_dueno)
    return {"message": "Restaurante actualizado correctamente"}

@app.post("/borrarrestaurante")
def borrar(data: RestauranteDelete, db: Session = Depends(get_db)):
    restaurante.borrar_restaurante(db, data.id_restaurante)
    return {"message": "Restaurante eliminado correctamente"}

#Mesas
class MesaBase(BaseModel):
    estado_de_disponibilidad: bool
    cant_personas: int
    NIT: int
    precio: float   

class MesaUpdate(MesaBase):
    id_mesa: int

class MesaDelete(BaseModel):
    id_mesa: int

@app.post("/insertarmesas")
def insertar(data: MesaBase, db: Session = Depends(get_db)):
    mesas.insertar_mesas(db, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio)
    return {"message": "Mesa insertada correctamente"}  

@app.post("/editarmesas")
def editar(data: MesaUpdate, db: Session = Depends(get_db)):
    mesas.editar_mesas(db, data.id_mesa, data.estado_de_disponibilidad, data.cant_personas, data.NIT, data.precio)
    return {"message": "Mesa actualizada correctamente"}

@app.post("/borrarmesas")
def borrar(data: MesaDelete, db: Session = Depends(get_db)):
    mesas.borrar_mesas(db, data.id_mesa)
    return {"message": "Mesa eliminada correctamente"}

#Cliente
class ClienteBase(BaseModel):
    id_credencial: int
    nombre1: str
    nombre2: str    
    apellido1: str
    apellido2: str
    tipo_documento: str
    documento: int
    nacionalidad: str
    telefono: str
    id_rol: int 

class ClienteUpdate(ClienteBase):
    id_cliente: int

class ClienteDelete(BaseModel):
    id_cliente: int     
    
@app.post("/insertarcliente")
def insertar(data: ClienteBase, db: Session = Depends(get_db)):
    cliente.insertar_clientes(db, data.id_credencial, data.nombre1, data.nombre2, data.apellido1, data.apellido2, data.tipo_documento, data.documento, data.nacionalidad, data.telefono, data.id_rol)
    return {"message": "Cliente insertado correctamente"}   

@app.post("/editarcliente")
def editar(data: ClienteUpdate, db: Session = Depends(get_db)):
    cliente.editar_clientes(db, data.id_cliente, data.id_credencial, data.nombre1, data.nombre2, data.apellido1, data.apellido2, data.tipo_documento, data.documento, data.nacionalidad, data.telefono, data.id_rol)
    return {"message": "Cliente actualizado correctamente"} 

@app.post("/borrarcliente")
def borrar(data: ClienteDelete, db: Session = Depends(get_db)):
    cliente.borrar_clientes(db, data.id_cliente)
    return {"message": "Cliente eliminado correctamente"}

#Empleado
class EmpleadoBase(BaseModel):
    id_credencial: int
    nombre1: str
    nombre2: str
    apellido1: str
    apellido2: str
    tipo_documento: str
    documento: int
    nacionalidad: str
    telefono: str
    id_rol: int
    NIT: int

class EmpleadoUpdate(EmpleadoBase):
    id_empleado: int

class EmpleadoDelete(BaseModel):
    id_empleado: int

@app.post("/insertarempleado")
def insertar(data: EmpleadoBase, db: Session = Depends(get_db)):
    empleado.insertar_empleado(db, data.id_credencial, data.nombre1, data.nombre2, data.apellido1, data.apellido2, data.tipo_documento, data.documento, data.nacionalidad, data.telefono, data.id_rol, data.NIT)
    return {"message": "Empleado insertado correctamente"}

@app.post("/editarempleado")
def editar(data: EmpleadoUpdate, db: Session = Depends(get_db)):
    empleado.editar_empleado(db, data.id_empleado, data.id_credencial, data.nombre1, data.nombre2, data.apellido1, data.apellido2, data.tipo_documento, data.documento, data.nacionalidad, data.telefono, data.id_rol, data.NIT)
    return {"message": "Empleado actualizado correctamente"}

@app.post("/borrarempleado")
def borrar(data: EmpleadoDelete, db: Session = Depends(get_db)):
    empleado.borrar_empleado(db, data.id_empleado)
    return {"message": "Empleado eliminado correctamente"}

#Encabezado_factura
class Encabezado_facturaBase(BaseModel):
    NIT: int
    nombre_restaurante: str
    direccion: str
    ciudad: str
    fecha: str
    id_cliente: int 

class Encabezado_facturaUpdate(Encabezado_facturaBase):
    id_encab_fact: int

class Encabezado_facturaDelete(BaseModel):
    id_encab_fact: int  
    
@app.post("/insertar_encabezado_factura")
def insertar(data: Encabezado_facturaBase, db: Session = Depends(get_db)):
    enc_fac.insertar_enc_fac(db, data.NIT, data.nombre_restaurante, data.direccion, data.ciudad, data.fecha, data.id_cliente)
    return {"message": "Encabezado_factura insertado correctamente"}    

@app.post("/editar_encabezado_factura")
def editar(data: Encabezado_facturaUpdate, db: Session = Depends(get_db)):
    enc_fac.editar_enc_fac(db, data.id_encab_fact, data.NIT, data.nombre_restaurante, data.direccion, data.ciudad, data.fecha, data.id_cliente)
    return {"message": "Encabezado_factura actualizado correctamente"}  

@app.post("/borrar_encabezado_factura")
def borrar(data: Encabezado_facturaDelete, db: Session = Depends(get_db)):
    enc_fac.borrar_enc_fac(db, data.id_encab_fact)
    return {"message": "Encabezado_factura eliminado correctamente"}    

#Detalle_factura
class Detalle_facturaBase(BaseModel):
    descripcion: str
    unidades: int
    precio_unitario: float
    precio_total: float
    forma_pago: str
    id_encab_fact: int

class Detalle_facturaUpdate(Detalle_facturaBase):
    id_det_fact: int

class Detalle_facturaDelete(BaseModel):
    id_det_fact: int

@app.post("/insertar_detalle_factura")
def insertar(data: Detalle_facturaBase, db: Session = Depends(get_db)):
    det_fac.insertar_det_fac(db, data.descripcion, data.unidades, data.precio_unitario, data.precio_total, data.forma_pago, data.id_encab_fact)
    return {"message": "Detalle_factura insertado correctamente"}

@app.post("/editar_detalle_factura")
def editar(data: Detalle_facturaUpdate, db: Session = Depends(get_db)):
    det_fac.editar_det_fac(db, data.id_det_fact, data.descripcion, data.unidades, data.precio_unitario, data.precio_total, data.forma_pago, data.id_encab_fact)
    return {"message": "Detalle_factura actualizado correctamente"}

@app.post("/borrar_detalle_factura")
def borrar(data: Detalle_facturaDelete, db: Session = Depends(get_db)):
    det_fac.borrar_det_fac(db, data.id_det_fact)
    return {"message": "Detalle_factura eliminado correctamente"}

#Reserva
class ReservaBase(BaseModel):
    id_mesa: int
    id_cliente: int
    id_encab_fact: int
    horario: str
    fecha: str

class ReservaUpdate(ReservaBase):
    id_reserva: int

class ReservaDelete(BaseModel):
    id_reserva: int

@app.post("/insertar_reserva")
def insertar(data: ReservaBase, db: Session = Depends(get_db)):
    reserva.insertar_reserva(db, data.id_mesa, data.id_cliente, data.id_encab_fact, data.horario, data.fecha)
    return {"message": "Reserva insertada correctamente"}

@app.post("/editar_reserva")
def editar(data: ReservaUpdate, db: Session = Depends(get_db)):
    reserva.editar_reserva(db, data.id_reserva, data.id_mesa, data.id_cliente, data.id_encab_fact, data.horario, data.fecha)
    return {"message": "Reserva actualizada correctamente"}

@app.post("/borrar_reserva")
def borrar(data: ReservaDelete, db: Session = Depends(get_db)):
    reserva.borrar_reserva(db, data.id_reserva)
    return {"message": "Reserva eliminada correctamente"} 
    
