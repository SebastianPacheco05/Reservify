from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import time, date


# Credenciales
class CredencialBase(BaseModel):
    email: str
    password: str


class CredencialUpdate(BaseModel):
    id_credencial: int
    email: str
    password: Optional[str] = None  # Si viene vacío, no se actualiza


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
    documento: int
    id_categoria: int
    url_imagen: Optional[str] = ""
    imagenes_referencia: Optional[List[str]] = None  # Máximo 15 URLs (Cloudinary)
    # Antelación mínima para reservar en este restaurante (en horas). 0 = sin restricción.
    min_anticipacion_horas: int = 0


class RestauranteUpdate(BaseModel):
    nit: int
    direccion: str
    nombre_restaurante: str
    descripcion_restaurante: str
    horario_apertura: str
    horario_cierre: str
    documento: int
    id_categoria: int
    # Antelación mínima para reservar en este restaurante (en horas). 0 = sin restricción.
    min_anticipacion_horas: int = 0


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


# Usuario (reemplaza Cliente/Dueno/Empleado; el rol define el tipo)
class UsuarioBase(BaseModel):
    id_credencial: int
    nombre: str
    apellido: str
    tipo_documento: str
    documento: int
    nacionalidad: Optional[str] = None
    telefono: Optional[str] = None
    id_rol: int
    nit: Optional[int] = None  # Solo empleado: restaurante donde trabaja


class UsuarioUpdate(UsuarioBase):
    pass


class UsuarioDelete(BaseModel):
    documento: int


class ListarUsuarios(BaseModel):
    documento: int


# Cliente (compatibilidad: mismo esquema que Usuario para rutas /cliente)
class ClienteBase(BaseModel):
    id_credencial: int
    nombre: str
    apellido: str
    tipo_documento: str
    documento: int
    nacionalidad: str
    telefono: str
    id_rol: int
    nit: Optional[int] = None


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


class Encabezado_facturaUpdate(BaseModel):
    id_encab_fact: int
    nit: int
    nombre_restaurante: str
    direccion: str
    ciudad: str
    fecha: str
    documento: int


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


class ActualizarEstadoReservaSchema(BaseModel):
    """Body para PATCH estado de reserva (dueño/admin/empleado)."""
    nuevo_estado: str  # activa (alias de confirmada) | confirmada | cancelada
    motivo_cancelacion: str | None = Field(None, max_length=250)  # obligatorio si nuevo_estado es cancelada; máx 250 caracteres


class CancelarReservaClienteSchema(BaseModel):
    """Body para que el cliente cancele su propia reserva."""
    motivo_cancelacion: str = Field(..., max_length=250)


class SMTPConfigSchema(BaseModel):
    """Configuración SMTP (solo admin/dueño/empleado en dashboard)."""
    host: str
    port: int
    usuario: str
    password_encrypted: str | None = None
    from_email: str
    consentimiento_archivo: bool | None = None  # obligatorio True la primera vez (modal)


class IMAPConfigSchema(BaseModel):
    """Configuración IMAP (solo admin/dueño/empleado en dashboard)."""
    host: str
    port: int
    usuario: str
    password_encrypted: str | None = None
    consentimiento_archivo: bool | None = None  # obligatorio True la primera vez (modal)


class AsignarAdministradorSchema(BaseModel):
    id_credencial: int  # Credencial del usuario a asignar como administrador del restaurante


class BuscarEmailSchema(BaseModel):
    email: str


class AsignarEmpleadoSchema(BaseModel):
    id_credencial: int


class CrearEmpleadoSchema(BaseModel):
    email: str


class ResponderCorreoSchema(BaseModel):
    """Body para enviar respuesta a un correo (desde dashboard)."""
    to_email: str
    subject: str
    body: str


class LoginSchema(BaseModel):
    """Schema para login de credenciales."""
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


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
    calificacion: int  # 1-5


class ComentarioCreate(BaseModel):
    nit: int
    comentario: str
    calificacion: int  # 1-5


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
    nit: Optional[int] = None  # Solo para rol empleado: restaurante donde trabaja
    
    
# Search Box
class BuscarRestaurante(BaseModel):
    nombre_restaurante: str


# Registrar Factura y Reserva
class FacturaReservaSchema(BaseModel):
    p_nit: int
    p_nombre_restaurante: str
    p_direccion: str
    p_ciudad: str
    p_email_cliente: str
    p_id_mesa: int
    p_num_comensales: int
    p_horario: str
    p_fecha: str
    p_forma_pago: str
    p_precio_total: float


class PaymentMethod(BaseModel):
    type: str
    token: Optional[str] = None
    installments: Optional[int] = None
    payment_description: Optional[str] = None
    # Campos para tokenización en el backend
    card_number: Optional[str] = None
    cvc: Optional[str] = None
    exp_month: Optional[str] = None
    exp_year: Optional[str] = None
    card_holder: Optional[str] = None

class PagoRequest(BaseModel):
    monto: float
    referencia: str
    correo_cliente: str
    payment_method: PaymentMethod


# Modelos para Webhook de Wompi
class TransactionData(BaseModel):
    id: str
    reference: str
    status: str
    amount_in_cents: int
    currency: str
    customer_email: Optional[str] = None
    payment_method_type: Optional[str] = None
    status_message: Optional[str] = None
    created_at: Optional[str] = None


class SignatureData(BaseModel):
    checksum: str
    properties: list[str]


class WebhookEventData(BaseModel):
    transaction: TransactionData


class WebhookEvent(BaseModel):
    event: str
    data: WebhookEventData
    signature: Optional[SignatureData] = None
    timestamp: Optional[int] = None
    environment: Optional[str] = None

# Confirmar Reserva y Crear Detalle de Factura
class ConfirmarReservaDetalleSchema(BaseModel):
    id_reserva: int
    forma_pago: str  # Efectivo, Tarjeta, Transferencia, Otro
