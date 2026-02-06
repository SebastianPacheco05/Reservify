/*
 * Script de creación de base de datos para el sistema de reservas de restaurantes
 * Este script crea todas las tablas necesarias para el funcionamiento del sistema
 * Incluye la eliminación de tablas existentes y la creación de nuevas con sus respectivas relaciones
 */

-- Primero se eliminan todas las tablas existentes en orden inverso a su creación
-- para evitar problemas de dependencias
DROP TABLE IF EXISTS "Reserva";
DROP TABLE IF EXISTS "Encabezado_Factura";
DROP TABLE IF EXISTS "Empleado";
DROP TABLE IF EXISTS "Comentarios";
DROP TABLE IF EXISTS "Cliente";
DROP TABLE IF EXISTS "Mesas";
DROP TABLE IF EXISTS "Calculos_mensuales";
DROP TABLE IF EXISTS "MAPA";
DROP TABLE IF EXISTS "Restaurante";
DROP TABLE IF EXISTS "Dueno";
DROP TABLE IF EXISTS "Roles";
DROP TABLE IF EXISTS "jwt_tokens";
DROP TABLE IF EXISTS "Credenciales";
DROP TABLE IF EXISTS "Categorias";


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
    documento DECIMAL(10, 0) PRIMARY KEY NOT NULL,  -- Documento de identidad único
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),  -- Tipo de documento con validación
    nombre VARCHAR(50) NOT NULL,  -- Primer nombre
    apellido VARCHAR(50) NOT NULL,  -- Primer apellido
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
    nit DECIMAL(10, 0) PRIMARY KEY NOT NULL,  -- nit como identificador único
    direccion VARCHAR(50) NOT NULL,  -- Dirección del restaurante
    nombre_restaurante VARCHAR(50) NOT NULL,  -- Nombre del restaurante
    descripcion_restaurante VARCHAR(100) NOT NULL,  -- Descripción del restaurante
    rating DECIMAL(2, 1) NOT NULL,  -- Rating del restaurante
    reviews INT NOT NULL,  -- Reviews del restaurante
    availableToday BOOLEAN NOT NULL,  -- Disponibilidad del restaurante
    horario_apertura TIME NOT NULL,  -- Hora de apertura
    horario_cierre TIME NOT NULL,  -- Hora de cierre
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al dueño
    id_categoria INT not null,  -- Referencia a la categoría
    url_image VARCHAR NOT NULL,  -- URL de la imagen del restaurante
    foreign key (id_categoria) references "Categorias" (id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Dueno" (documento) ON DELETE CASCADE,
    CHECK (horario_apertura < horario_cierre)  -- Validación de horarios
);

-- Tabla MAPA: coordenadas GPS para mostrar cada restaurante en el mapa
CREATE TABLE "MAPA" (
    nit DECIMAL(10, 0) NOT NULL PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Tabla Mesas: Almacena información de las mesas de cada restaurante
CREATE TABLE "Mesas" (
    id_mesa SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    estado_de_disponibilidad BOOLEAN NOT NULL,  -- Estado de disponibilidad
    cant_personas INT CHECK (cant_personas > 0),  -- Capacidad de personas
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),  -- Precio de la mesa
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Tabla Cliente: Almacena información de los clientes
CREATE TABLE "Cliente" (
    id_credencial INT NOT NULL UNIQUE,  -- Referencia a credenciales únicas
    nombre VARCHAR(50) NOT NULL,  -- Primer nombre
    apellido VARCHAR(50) NOT NULL,  -- Primer apellido
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),  -- Tipo de documento con validación
    documento DECIMAL(10, 0) PRIMARY KEY NOT NULL CHECK (documento > 0),  -- Número de documento único
    nacionalidad VARCHAR(20) NOT NULL,  -- Nacionalidad
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),  -- Teléfono con validación de formato
    id_rol INT NOT NULL,  -- Referencia al rol
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

-- Tabla Empleado: Almacena información de los empleados
CREATE TABLE "Empleado" (
    id_credencial INT NOT NULL UNIQUE,  -- Referencia a credenciales únicas
    nombre VARCHAR(50) NOT NULL,  -- Primer nombre
    apellido VARCHAR(50) NOT NULL,  -- Primer apellido
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),  -- Tipo de documento con validación
    documento DECIMAL(10, 0) PRIMARY KEY NOT NULL CHECK (documento > 0),  -- Número de documento único
    nacionalidad VARCHAR(20) NOT NULL,  -- Nacionalidad
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),  -- Teléfono con validación de formato
    id_rol INT NOT NULL,  -- Referencia al rol
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

-- Tabla Encabezado_Factura: Almacena la información principal de las facturas
CREATE TABLE "Encabezado_Factura" (
    id_encab_fact SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    nombre_restaurante VARCHAR(50) NOT NULL,  -- Nombre del restaurante
    direccion VARCHAR(50) NOT NULL,  -- Dirección del restaurante
    ciudad VARCHAR(20) NOT NULL,  -- Ciudad
    fecha DATE NOT NULL CHECK (fecha = CURRENT_DATE),  -- Fecha de la factura
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al cliente
    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro', 'Pendiente')),  -- Forma de pago con validación
    precio_total DECIMAL(10, 2) NOT NULL,  -- Precio total
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Cliente" (documento) ON DELETE CASCADE
);

-- Tabla Reserva: Almacena las reservas de mesas
CREATE TABLE "Reserva" (
    id_reserva SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    id_mesa INT NOT NULL,  -- Referencia a la mesa
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al cliente
    id_encab_fact INT,  -- Referencia a la factura
    estado_reserva VARCHAR NOT NULL DEFAULT 'no presentada'
    CHECK (estado_reserva IN (
    'pendiente', 'confirmada', 'en curso', 'finalizada', 'cancelada', 'no presentada')
    ),-- Estado de la reserva con validación
    num_comensales INT NOT NULL DEFAULT 1,  -- numero de personas
    horario TIME NOT NULL,  -- Horario de la reserva
    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),  -- Fecha de la reserva
    UNIQUE (id_mesa, fecha, horario),  -- Restricción de unicidad para evitar reservas duplicadas
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Cliente" (documento) ON DELETE CASCADE,
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

CREATE TABLE "Calculos_mensuales" (
    id_calculo SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    mes INT NOT NULL CHECK (mes >= 1 AND mes <= 12),  -- Mes del cálculo
    anio INT NOT NULL CHECK (anio > 0),  -- Año del cálculo
    total_reservas INT NOT NULL DEFAULT 0,  -- Total de reservas del mes
    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- Total facturado del mes
    total_clientes INT NOT NULL DEFAULT 0,  -- Total de clientes del mes
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

CREATE TABLE "Comentarios" (
    id_comentario SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al cliente
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    comentario TEXT NOT NULL,  -- Comentario del cliente
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),  -- Fecha del comentario
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),  -- Calificación del 1 al 5
    FOREIGN KEY (documento) REFERENCES "Cliente" (documento) ON DELETE CASCADE,
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Tabla JWT_Tokens: Una fila por sesión. token = access token, refresh_token = token de refresco.
-- Permite renovar el access token sin cerrar sesión buscando por refresh_token.
CREATE TABLE "jwt_tokens" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    token TEXT NOT NULL,  -- Access token (se actualiza en cada refresh)
    refresh_token TEXT NOT NULL UNIQUE,  -- Token de refresco; búsqueda por este valor al renovar
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,  -- Expiración del access token
    refresh_expires_at TIMESTAMP NOT NULL,  -- Expiración del refresh token
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_jwt_tokens_refresh_token ON "jwt_tokens" (refresh_token);

