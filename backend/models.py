from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import time, date


# Credenciales
class CredencialBase(BaseModel):
    email: str
    password: str


class CredencialUpdate(CredencialBase):
    id_credencial: int


class CredencialDelete(BaseModel):
    id_credencial: int


# Roles
class RolBase(BaseModel):
    nombre_rol: str
    descripcion: str


class RolUpdate(RolBase):
    id_rol: int


class RolDelete(BaseModel):
    id_rol: int


# Dueno
class DuenoBase(BaseModel):
    documento: int
    tipo_documento: str
    nombre: str
    apellido: str
    id_rol: int
    id_credencial: int


class DuenoUpdate(DuenoBase):
    documento: int


class DuenoDelete(BaseModel):
    documento: int


# Restaurante
class RestauranteBase(BaseModel):
    nit: int
    direccion: str
    nombre_restaurante: str
    descripcion_restaurante: str
    horario_apertura: str
    horario_cierre: str


class RestauranteUpdate(RestauranteBase):
    nit: int


class RestauranteDelete(BaseModel):
    nit: int


# Mesas
class MesaBase(BaseModel):
    estado_de_disponibilidad: bool
    cant_personas: int
    nit: int
    precio: float


class MesaUpdate(MesaBase):
    id_mesa: int


class MesaDelete(BaseModel):
    id_mesa: int


# Cliente
class ClienteBase(BaseModel):
    id_credencial: int
    nombre: str
    apellido: str
    tipo_documento: str
    documento: int
    nacionalidad: str
    telefono: str
    id_rol: int


class ClienteUpdate(ClienteBase):
    documento: int


class ClienteDelete(BaseModel):
    documento: int


# Empleado
class EmpleadoBase(BaseModel):
    id_credencial: int
    nombre: str
    apellido: str
    tipo_documento: str
    documento: int
    nacionalidad: str
    telefono: str
    id_rol: int
    nit: int


class EmpleadoUpdate(EmpleadoBase):
    documento: int


class EmpleadoDelete(BaseModel):
    documento: int


# Encabezado_factura
class Encabezado_facturaBase(BaseModel):
    nit: int
    nombre_restaurante: str
    direccion: str
    ciudad: str
    fecha: str


class Encabezado_facturaUpdate(Encabezado_facturaBase):
    id_encab_fact: int


class Encabezado_facturaDelete(BaseModel):
    id_encab_fact: int


# Detalle_factura
class Detalle_facturaBase(BaseModel):
    descripcion: List[str]
    unidades: List[int]
    precio_unitario: List[float]
    precio_total: float
    forma_pago: str
    id_encab_fact: int


class Detalle_facturaUpdate(Detalle_facturaBase):
    id_det_fact: int


class Detalle_facturaDelete(BaseModel):
    id_det_fact: int


# Reserva
class ReservaBase(BaseModel):
    id_mesa: int
    id_encab_fact: int
    horario: str
    fecha: str


class ReservaUpdate(ReservaBase):
    id_reserva: int


class ReservaDelete(BaseModel):
    id_reserva: int


class login(BaseModel):
    email: str
    password: str


class ListarRoles(BaseModel):
    id_rol: int


class ListarDuenos(BaseModel):
    documento: int


class ListarClientes(BaseModel):
    documento: int


class ListarEmpleados(BaseModel):
    documento: int


class ListarRestaurantes(BaseModel):
    nit: int


class ListarMesas(BaseModel):
    id_mesa: int


class ListarReservas(BaseModel):
    id_reserva: int


class ListarEncabezadoFactura(BaseModel):
    id_encab_fact: int


class ListarDetalleFactura(BaseModel):
    id_det_fact: int


class ListarCategorias(BaseModel):
    id_categoria: int


class insertarCategorias(BaseModel):
    nombre_categoria: str


class editarCategorias(BaseModel):
    id_categoria: int
    nombre_categoria: str


class borrarCategorias(BaseModel):
    id_categoria: int


class EmailSchema(BaseModel):
    to: EmailStr
    subject: str
    message: str


# Calculos Mensuales
class CalculoMensualBase(BaseModel):
    nit: int
    mes: int
    anio: int
    total_reservas: int
    revenue: float
    total_clientes: int


class CalculoMensualUpdate(CalculoMensualBase):
    id_calculo: int


class CalculoMensualDelete(BaseModel):
    id_calculo: int


class ListarCalculoMensual(BaseModel):
    id_calculo: int


# Comentarios
class ComentarioBase(BaseModel):
    documento: int
    nit: int
    comentario: str


class ComentarioUpdate(ComentarioBase):
    id_comentario: int


class ComentarioDelete(BaseModel):
    id_comentario: int


class ListarComentarios(BaseModel):
    id_comentario: int

class RegistrarCliente(BaseModel):
    email: str
    password: str
    nombre: str
    apellido: str
    tipo_documento: str
    documento: int
    nacionalidad: str
    telefono: str
    id_rol: int
    
    
# Search Box
class BuscarRestaurante(BaseModel):
    nombre_restaurante: str


