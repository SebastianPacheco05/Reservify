/*
 * Script de creación de base de datos para el sistema de reservas de restaurantes
 * Este script crea todas las tablas necesarias para el funcionamiento del sistema
 * Incluye la eliminación de tablas existentes y la creación de nuevas con sus respectivas relaciones
 */

-- Primero se eliminan todas las tablas existentes en orden inverso a su creación
-- para evitar problemas de dependencias
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
DROP TABLE IF EXISTS "Categorias" CASCADE;
DROP TABLE IF EXISTS "Comentarios" CASCADE;

-- Tabla Credenciales: Almacena la información de autenticación de usuarios
CREATE TABLE "Credenciales" (
    id_credencial SERIAL NOT NULL PRIMARY KEY,  -- Identificador único autoincremental
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),  -- Email único con validación de formato
    password VARCHAR(255) NOT NULL  -- Contraseña encriptada
);

-- Tabla Roles: Define los diferentes roles en el sistema
CREATE TABLE "Roles" (
    id_rol SERIAL NOT NULL UNIQUE PRIMARY KEY,  -- Identificador único autoincremental
    nombre_rol VARCHAR(15) NOT NULL,  -- Nombre del rol
    descripcion VARCHAR(100) NOT NULL  -- Descripción del rol
);

-- Tabla Dueno: Almacena información de los dueños de restaurantes
CREATE TABLE "Dueno" (
    id_dueno SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    nombre1 VARCHAR(50) NOT NULL,  -- Primer nombre
    nombre2 VARCHAR(50),  -- Segundo nombre (opcional)
    apellido1 VARCHAR(50) NOT NULL,  -- Primer apellido
    apellido2 VARCHAR(50),  -- Segundo apellido (opcional)
    id_rol INT NOT NULL,  -- Referencia al rol
    id_credencial INT NOT NULL UNIQUE,  -- Referencia a credenciales únicas
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

-- Tabla Categorias: Define las categorías de restaurantes
CREATE TABLE "Categorias" (
    id_categoria SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    nombre_categoria varchar NOT NULL  -- Nombre de la categoría
);

-- Tabla Restaurante: Almacena información de los restaurantes
CREATE TABLE "Restaurante" (
    NIT DECIMAL(10, 0) PRIMARY KEY NOT NULL,  -- NIT como identificador único
    direccion VARCHAR(50) NOT NULL,  -- Dirección del restaurante
    nombre_restaurante VARCHAR(50) NOT NULL,  -- Nombre del restaurante
    descripcion_restaurante VARCHAR(100) NOT NULL,  -- Descripción del restaurante
    horario_apertura TIME NOT NULL,  -- Hora de apertura
    horario_cierre TIME NOT NULL,  -- Hora de cierre
    id_dueno INT NOT NULL,  -- Referencia al dueño
    id_categoria INT not null,  -- Referencia a la categoría
    foreign key (id_categoria) references "Categorias" (id_categoria)on delete cascade,
    FOREIGN KEY (id_dueno) REFERENCES "Dueno" (id_dueno) ON DELETE CASCADE,
    CHECK (horario_apertura < horario_cierre)  -- Validación de horarios
);

-- Tabla Mesas: Almacena información de las mesas de cada restaurante
CREATE TABLE "Mesas" (
    id_mesa SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    estado_de_disponibilidad BOOLEAN NOT NULL,  -- Estado de disponibilidad
    cant_personas INT CHECK (cant_personas > 0),  -- Capacidad de personas
    NIT INT NOT NULL,  -- Referencia al restaurante
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),  -- Precio de la mesa
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE
);

-- Tabla Cliente: Almacena información de los clientes
CREATE TABLE "Cliente" (
    id_cliente SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    id_credencial INT NOT NULL UNIQUE,  -- Referencia a credenciales únicas
    nombre1 VARCHAR(50) NOT NULL,  -- Primer nombre
    nombre2 VARCHAR(50),  -- Segundo nombre (opcional)
    apellido1 VARCHAR(50) NOT NULL,  -- Primer apellido
    apellido2 VARCHAR(50),  -- Segundo apellido (opcional)
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),  -- Tipo de documento con validación
    documento BIGINT NOT NULL UNIQUE CHECK (documento > 0),  -- Número de documento único
    nacionalidad VARCHAR(20) NOT NULL,  -- Nacionalidad
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),  -- Teléfono con validación de formato
    id_rol INT NOT NULL,  -- Referencia al rol
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

-- Tabla Empleado: Almacena información de los empleados
CREATE TABLE "Empleado" (
    id_empleado SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    id_credencial INT NOT NULL UNIQUE,  -- Referencia a credenciales únicas
    nombre1 VARCHAR(50) NOT NULL,  -- Primer nombre
    nombre2 VARCHAR(50),  -- Segundo nombre (opcional)
    apellido1 VARCHAR(50) NOT NULL,  -- Primer apellido
    apellido2 VARCHAR(50),  -- Segundo apellido (opcional)
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),  -- Tipo de documento con validación
    documento BIGINT UNIQUE NOT NULL CHECK (documento > 0),  -- Número de documento único
    nacionalidad VARCHAR(20) NOT NULL,  -- Nacionalidad
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),  -- Teléfono con validación de formato
    id_rol INT NOT NULL,  -- Referencia al rol
    NIT INT NOT NULL,  -- Referencia al restaurante
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

-- Tabla Encabezado_Factura: Almacena la información principal de las facturas
CREATE TABLE "Encabezado_Factura" (
    id_encab_fact SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    NIT INT NOT NULL,  -- Referencia al restaurante
    nombre_restaurante VARCHAR(50) NOT NULL,  -- Nombre del restaurante
    direccion VARCHAR(50) NOT NULL,  -- Dirección del restaurante
    ciudad VARCHAR(20) NOT NULL,  -- Ciudad
    fecha DATE NOT NULL CHECK (fecha = CURRENT_DATE),  -- Fecha de la factura
    id_cliente INT NOT NULL,  -- Referencia al cliente
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente) ON DELETE CASCADE
);

-- Tabla Detalle_Factura: Almacena los detalles de cada factura
CREATE TABLE "Detalle_Factura" (
    id_det_fact SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    descripcion VARCHAR(100)[] NOT NULL,  -- Array de descripciones
    unidades INT[] NOT NULL,  -- Array de unidades
    precio_unitario DECIMAL(10, 2)[] NOT NULL,  -- Array de precios unitarios
    precio_total DECIMAL(10, 2) NOT NULL,  -- Precio total
    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro')),  -- Forma de pago con validación
    id_encab_fact INT NOT NULL,  -- Referencia al encabezado de la factura
    CHECK (  -- Validación de longitud de arrays
        array_length(descripcion, 1) = array_length(unidades, 1)
        AND array_length(descripcion, 1) = array_length(precio_unitario, 1)
        ),
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

-- Tabla Reserva: Almacena las reservas de mesas
CREATE TABLE "Reserva" (
    id_reserva SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    id_mesa INT NOT NULL,  -- Referencia a la mesa
    id_cliente INT NOT NULL,  -- Referencia al cliente
    id_encab_fact INT NOT NULL,  -- Referencia a la factura
    estado_reserva VARCHAR NOT NULL DEFAULT 'no presentada'
    CHECK (estado_reserva IN (
    'pendiente', 'confirmada', 'en curso', 'finalizada', 'cancelada', 'no presentada')
    ), -- Estado de la reserva con validación
    horario TIME NOT NULL,  -- Horario de la reserva
    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),  -- Fecha de la reserva
    UNIQUE (id_mesa, fecha, horario),  -- Restricción de unicidad para evitar reservas duplicadas
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa) ON DELETE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

CREATE TABLE "Comentarios" (
    id_comentario SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    id_cliente INT NOT NULL,  -- Referencia al cliente
    id_restaurante INT NOT NULL,  -- Referencia al restaurante
    comentario TEXT NOT NULL,  -- Comentario del cliente
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_restaurante) REFERENCES "Restaurante" (NIT) ON DELETE CASCADE
);