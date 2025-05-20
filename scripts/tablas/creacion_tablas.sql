/*
 * Script de creación de base de datos para el sistema de reservas de restaurantes
 * Este script crea todas las tablas necesarias para el funcionamiento del sistema
 * Incluye la eliminación de tablas existentes y la creación de nuevas con sus respectivas relaciones
 */

-- Eliminación de tablas si existen para evitar conflictos
-- Se utiliza CASCADE para eliminar también las dependencias
DROP TABLE IF EXISTS "Reserva" CASCADE;
DROP TABLE IF EXISTS "Detalle_Factura" CASCADE;
DROP TABLE IF EXISTS "Encabezado_Factura" CASCADE;
DROP TABLE IF EXISTS "Empleado" CASCADE;
DROP TABLE IF EXISTS "Cliente" CASCADE;
DROP TABLE IF EXISTS "Restaurante" CASCADE;
DROP TABLE IF EXISTS "Dueno" CASCADE;
DROP TABLE IF EXISTS "Mesas" CASCADE;
DROP TABLE IF EXISTS "Roles" CASCADE;
DROP TABLE IF EXISTS "Credenciales" CASCADE;

/*
 * Tabla Credenciales
 * Almacena la información de autenticación de todos los usuarios del sistema
 * Campos:
 * - id_credencial: Identificador único autoincremental
 * - email: Correo electrónico único con validación de formato
 * - password: Contraseña encriptada
 */
CREATE TABLE "Credenciales" (
    id_credencial SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password VARCHAR(255) NOT NULL
);

/*
 * Tabla Roles
 * Define los diferentes roles de usuario en el sistema
 * Campos:
 * - id_rol: Identificador único autoincremental
 * - nombre_rol: Nombre del rol (máximo 15 caracteres)
 * - descripcion: Descripción detallada del rol
 */
CREATE TABLE "Roles" (
    id_rol SERIAL NOT NULL UNIQUE PRIMARY KEY,
    nombre_rol VARCHAR(15) NOT NULL,
    descripcion VARCHAR(100) NOT NULL
);

/*
 * Tabla Dueno
 * Almacena la información de los dueños de restaurantes
 * Campos:
 * - id_dueno: Identificador único autoincremental
 * - nombre1, nombre2: Nombres del dueño (nombre2 es opcional)
 * - apellido1, apellido2: Apellidos del dueño (apellido2 es opcional)
 * - id_rol: Referencia al rol del dueño
 * - id_credencial: Referencia a las credenciales del dueño
 */
CREATE TABLE "Dueno" (
    id_dueno SERIAL PRIMARY KEY NOT NULL,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    id_rol INT NOT NULL,
    id_credencial INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

/*
 * Tabla Restaurante
 * Almacena la información de los restaurantes registrados
 * Campos:
 * - NIT: Número de identificación tributaria (clave primaria)
 * - direccion: Dirección física del restaurante
 * - nombre_restaurante: Nombre comercial del restaurante
 * - descripcion_restaurante: Descripción detallada del restaurante
 * - horario_apertura: Hora de apertura
 * - horario_cierre: Hora de cierre
 * - id_dueno: Referencia al dueño del restaurante
 */
CREATE TABLE "Restaurante" (
    NIT DECIMAL(10, 0) PRIMARY KEY NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    nombre_restaurante VARCHAR(50) NOT NULL,
    descripcion_restaurante VARCHAR(100) NOT NULL,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    id_dueno INT NOT NULL,
    FOREIGN KEY (id_dueno) REFERENCES "Dueno" (id_dueno) ON DELETE CASCADE,
    CHECK (horario_apertura < horario_cierre)
);

/*
 * Tabla Mesas
 * Almacena la información de las mesas disponibles en cada restaurante
 * Campos:
 * - id_mesa: Identificador único autoincremental
 * - estado_de_disponibilidad: Indica si la mesa está disponible
 * - cant_personas: Capacidad de la mesa
 * - NIT: Referencia al restaurante al que pertenece la mesa
 * - precio: Precio base de la mesa
 */
CREATE TABLE "Mesas" (
    id_mesa SERIAL PRIMARY KEY NOT NULL,
    estado_de_disponibilidad BOOLEAN NOT NULL,
    cant_personas INT CHECK (cant_personas > 0),
    NIT INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE
);

/*
 * Tabla Cliente
 * Almacena la información de los clientes del sistema
 * Campos:
 * - id_cliente: Identificador único autoincremental
 * - id_credencial: Referencia a las credenciales del cliente
 * - nombre1, nombre2: Nombres del cliente
 * - apellido1, apellido2: Apellidos del cliente
 * - tipo_documento: Tipo de documento de identidad
 * - documento: Número de documento único
 * - nacionalidad: País de origen
 * - telefono: Número de teléfono con validación de formato
 * - id_rol: Referencia al rol del cliente
 */
CREATE TABLE "Cliente" (
    id_cliente SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
    documento BIGINT NOT NULL UNIQUE CHECK (documento > 0),
    nacionalidad VARCHAR(20) NOT NULL,
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

/*
 * Tabla Empleado
 * Almacena la información de los empleados de los restaurantes
 * Campos:
 * - id_empleado: Identificador único autoincremental
 * - id_credencial: Referencia a las credenciales del empleado
 * - nombre1, nombre2: Nombres del empleado
 * - apellido1, apellido2: Apellidos del empleado
 * - tipo_documento: Tipo de documento de identidad
 * - documento: Número de documento único
 * - nacionalidad: País de origen
 * - telefono: Número de teléfono con validación de formato
 * - id_rol: Referencia al rol del empleado
 * - NIT: Referencia al restaurante donde trabaja
 */
CREATE TABLE "Empleado" (
    id_empleado SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    nombre1 VARCHAR(50) NOT NULL,
    nombre2 VARCHAR(50),
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50),
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
    documento BIGINT UNIQUE NOT NULL CHECK (documento > 0),
    nacionalidad VARCHAR(20) NOT NULL,
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),
    id_rol INT NOT NULL,
    NIT INT NOT NULL,
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

/*
 * Tabla Encabezado_Factura
 * Almacena la información general de cada factura
 * Campos:
 * - id_encab_fact: Identificador único autoincremental
 * - NIT: Referencia al restaurante
 * - nombre_restaurante: Nombre del restaurante
 * - direccion: Dirección del restaurante
 * - ciudad: Ciudad donde se encuentra el restaurante
 * - fecha: Fecha de la factura (debe ser la fecha actual)
 * - id_cliente: Referencia al cliente
 */
CREATE TABLE "Encabezado_Factura" (
    id_encab_fact SERIAL PRIMARY KEY NOT NULL,
    NIT INT NOT NULL,
    nombre_restaurante VARCHAR(50) NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    ciudad VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL CHECK (fecha = CURRENT_DATE),
    id_cliente INT NOT NULL,
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente) ON DELETE CASCADE
);

/*
 * Tabla Detalle_Factura
 * Almacena los detalles de cada factura
 * Campos:
 * - id_det_fact: Identificador único autoincremental
 * - descripcion: Array de descripciones de los items
 * - unidades: Array de cantidades de cada item
 * - precio_unitario: Array de precios unitarios
 * - precio_total: Precio total de la factura
 * - forma_pago: Método de pago utilizado
 * - id_encab_fact: Referencia al encabezado de la factura
 */
CREATE TABLE "Detalle_Factura" (
    id_det_fact SERIAL PRIMARY KEY NOT NULL,
    descripcion VARCHAR(100)[] NOT NULL,
    unidades INT[] NOT NULL,
    precio_unitario DECIMAL(10, 2)[] NOT NULL,   
    precio_total DECIMAL(10, 2) NOT NULL,
    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro')),
    id_encab_fact INT NOT NULL,
    CHECK (
        array_length(descripcion, 1) = array_length(unidades, 1)
        AND array_length(descripcion, 1) = array_length(precio_unitario, 1)
        ), 
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

/*
 * Tabla Reserva
 * Almacena las reservas realizadas por los clientes
 * Campos:
 * - id_reserva: Identificador único autoincremental
 * - id_mesa: Referencia a la mesa reservada
 * - id_cliente: Referencia al cliente que realiza la reserva
 * - id_encab_fact: Referencia a la factura asociada
 * - horario: Hora de la reserva
 * - fecha: Fecha de la reserva (debe ser igual o posterior a la fecha actual)
 */
CREATE TABLE "Reserva" (
    id_reserva SERIAL PRIMARY KEY NOT NULL,
    id_mesa INT NOT NULL,
    id_cliente INT NOT NULL,
    id_encab_fact INT NOT NULL,
    horario TIME NOT NULL,
    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),
    UNIQUE (id_mesa, fecha, horario),
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);


