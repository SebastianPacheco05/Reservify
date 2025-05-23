from pydantic import BaseModel
from typing import List


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


# Restaurante
class RestauranteBase(BaseModel):
    NIT: int
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


# Mesas
class MesaBase(BaseModel):
    estado_de_disponibilidad: bool
    cant_personas: int
    NIT: int
    precio: float


class MesaUpdate(MesaBase):
    id_mesa: int


class MesaDelete(BaseModel):
    id_mesa: int


# Cliente
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


# Empleado
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


# Encabezado_factura
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
    id_cliente: int
    id_encab_fact: int
    horario: str
    fecha: str


class ReservaUpdate(ReservaBase):
    id_reserva: int


class ReservaDelete(BaseModel):
    id_reserva: int


class ListarCredenciales(BaseModel):
    id_credencial: int


class ListarRoles(BaseModel):
    id_rol: int


class ListarDuenos(BaseModel):
    id_dueno: int


class ListarClientes(BaseModel):
    id_cliente: int


class ListarEmpleados(BaseModel):
    id_empleado: int


class ListarRestaurantes(BaseModel):
    id_restaurante: int


class ListarMesas(BaseModel):
    id_mesa: int


class ListarReservas(BaseModel):
    id_reserva: int


class ListarEncabezadoFactura(BaseModel):
    id_encab_fact: int


class ListarDetalleFactura(BaseModel):
    id_det_fact: int
