/*
 * Script de creaciÃ³n de base de datos para el sistema de reservas de restaurantes
 * Este script crea todas las tablas necesarias para el funcionamiento del sistema
 * Incluye la eliminaciÃ³n de tablas existentes y la creaciÃ³n de nuevas con sus respectivas relaciones
 */

-- Primero se eliminan todas las tablas existentes en orden inverso a su creaciÃ³n
-- para evitar problemas de dependencias
DROP TABLE IF EXISTS "Reserva";
DROP TABLE IF EXISTS "Comentarios";
DROP TABLE IF EXISTS "Calculos_mensuales";
DROP TABLE IF EXISTS "Imagen_referencia_restaurante";
DROP TABLE IF EXISTS "Mesas";
DROP TABLE IF EXISTS "Encabezado_Factura";
DROP TABLE IF EXISTS "Restaurante";
DROP TABLE IF EXISTS "Mails";
DROP TABLE IF EXISTS "IMAP_config";
DROP TABLE IF EXISTS "SMTP_config";
DROP TABLE IF EXISTS "Password_Reset_Codes";
DROP TABLE IF EXISTS "jwt_tokens";
DROP TABLE IF EXISTS "Usuario";
DROP TABLE IF EXISTS "Categorias";
DROP TABLE IF EXISTS "Roles";
DROP TABLE IF EXISTS "Credenciales";


-- Tabla Credenciales: Almacena la informaciÃ³n de autenticaciÃ³n de usuarios
CREATE TABLE "Credenciales" (
    id_credencial SERIAL NOT NULL PRIMARY KEY,  -- Identificador Ãºnico autoincremental
    email VARCHAR(100) NOT NULL UNIQUE CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND 
        length(email) <= 100
    ),  -- Email Ãºnico con validaciÃ³n de formato (solo caracteres ASCII, sin Unicode)
    password VARCHAR(255) NOT NULL  -- ContraseÃ±a encriptada
);

-- Tabla Roles: Define los diferentes roles en el sistema
CREATE TABLE "Roles" (
    id_rol SERIAL NOT NULL UNIQUE PRIMARY KEY,  -- Identificador Ãºnico autoincremental
    nombre_rol VARCHAR(15) NOT NULL,  -- Nombre del rol
    descripcion VARCHAR(100) NOT NULL  -- DescripciÃ³n del rol
);

-- Roles iniciales del sistema
INSERT INTO "Roles" (id_rol, nombre_rol, descripcion) VALUES
    (1, 'dueÃ±o', 'Propietario de uno o mÃ¡s restaurantes'),
    (2, 'cliente', 'Usuario que realiza reservas en restaurantes'),
    (3, 'empleado', 'Trabajador vinculado a un restaurante'),
    (4, 'administrador', 'Administrador general de varios restaurantes')
ON CONFLICT (id_rol) DO NOTHING;

-- Tabla Usuario: Almacena todos los usuarios del sistema (cliente, dueÃ±o, empleado) segÃºn id_rol
-- DueÃ±o: vinculado a restaurantes por Restaurante.documento = Usuario.documento
-- Empleado: vinculado a un restaurante por Usuario.nit (restaurante donde trabaja)
CREATE TABLE "Usuario" (
    documento DECIMAL(10, 0) PRIMARY KEY NOT NULL CHECK (documento > 0),
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    id_rol INT NOT NULL,
    id_credencial INT NOT NULL UNIQUE,
    nacionalidad VARCHAR(20) NOT NULL DEFAULT 'sin dato',
    telefono VARCHAR(10) NOT NULL DEFAULT 'sin dato' CHECK (telefono ~ '^[0-9]{10}$'),
    nit BIGINT NULL,  -- Solo para rol empleado: restaurante donde trabaja; dueÃ±o se vincula por Restaurante.documento
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

-- Tabla Categorias: Define las categorÃ­as de restaurantes
CREATE TABLE "Categorias" (
    id_categoria SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental
    nombre_categoria varchar NOT NULL  -- Nombre de la categorÃ­a
);

-- Tabla Restaurante: Almacena informaciÃ³n de los restaurantes
CREATE TABLE "Restaurante" (
    nit BIGINT PRIMARY KEY NOT NULL,  -- nit como identificador Ãºnico
    direccion VARCHAR(255) NOT NULL,  -- DirecciÃ³n del restaurante
    nombre_restaurante VARCHAR(50) NOT NULL,  -- Nombre del restaurante
    descripcion_restaurante VARCHAR(100) NOT NULL,  -- DescripciÃ³n del restaurante
    rating DECIMAL(2, 1) NOT NULL,  -- Rating del restaurante
    reviews INT NOT NULL,  -- Reviews del restaurante
    availableToday BOOLEAN NOT NULL,  -- Disponibilidad del restaurante
    horario_apertura TIME NOT NULL,  -- Hora de apertura
    horario_cierre TIME NOT NULL,  -- Hora de cierre
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al dueÃ±o
    id_categoria INT not null,  -- Referencia a la categorÃ­a
    url_image VARCHAR NOT NULL,  -- URL de la imagen del restaurante
    -- AntelaciÃ³n mÃ­nima en horas para crear una reserva (0 = sin restricciÃ³n).
    -- Ej: 24 = al menos 1 dÃ­a antes, 2 = al menos 2 horas antes.
    min_anticipacion_horas INT NOT NULL DEFAULT 0 CHECK (min_anticipacion_horas >= 0),
    lat DOUBLE PRECISION NOT NULL DEFAULT 0,  -- Latitud para mostrar el restaurante en el mapa (0 = sin dato)
    lng DOUBLE PRECISION NOT NULL DEFAULT 0,  -- Longitud para mostrar el restaurante en el mapa (0 = sin dato)
    foreign key (id_categoria) references "Categorias" (id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,
    CHECK (horario_apertura < horario_cierre)  -- ValidaciÃ³n de horarios
);

-- Tabla Imagen_referencia_restaurante: Almacena imÃ¡genes de referencia de restaurantes (mÃ¡ximo 15 por NIT)
CREATE TABLE "Imagen_referencia_restaurante" (
    nit BIGINT NOT NULL,
    url_imagen VARCHAR NOT NULL,
    orden INT NOT NULL DEFAULT 0 CHECK (orden >= 0 AND orden < 15),
    PRIMARY KEY (nit, orden),
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Crear Ã­ndice para bÃºsquedas rÃ¡pidas por NIT
CREATE INDEX idx_imagen_ref_nit ON "Imagen_referencia_restaurante" (nit);

-- Comentarios para documentaciÃ³n
COMMENT ON TABLE "Imagen_referencia_restaurante" IS 'Almacena imÃ¡genes de referencia de restaurantes (mÃ¡ximo 15 por NIT)';
COMMENT ON COLUMN "Imagen_referencia_restaurante".nit IS 'NIT del restaurante';
COMMENT ON COLUMN "Imagen_referencia_restaurante".url_imagen IS 'URL de la imagen (Cloudinary)';
COMMENT ON COLUMN "Imagen_referencia_restaurante".orden IS 'Orden de la imagen (0-14)';

-- Tabla Mesas: Almacena informaciÃ³n de las mesas de cada restaurante
CREATE TABLE "Mesas" (
    id_mesa SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental
    estado_de_disponibilidad BOOLEAN NOT NULL,  -- Estado de disponibilidad
    cant_personas INT NOT NULL CHECK (cant_personas > 0),  -- Capacidad de personas
    nit BIGINT NOT NULL,  -- Referencia al restaurante
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),  -- Precio de la mesa
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Tabla Encabezado_Factura: Almacena la informaciÃ³n principal de las facturas
CREATE TABLE "Encabezado_Factura" (
    id_encab_fact SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental
    nit BIGINT NOT NULL,  -- Referencia al restaurante
    nombre_restaurante VARCHAR(255) NOT NULL,  -- Nombre del restaurante
    direccion VARCHAR(255) NOT NULL,  -- DirecciÃ³n del restaurante (ej. Nominatim)
    ciudad VARCHAR(255) NOT NULL,  -- Ciudad
    fecha DATE NOT NULL CHECK (
        fecha >= CURRENT_DATE - INTERVAL '1 day'
        AND fecha <= CURRENT_DATE + INTERVAL '1 day'
    ),  -- Fecha de la factura (permite pequeÃ±as diferencias de zona horaria)
    documento BIGINT NOT NULL,  -- Referencia al cliente
    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro', 'Pendiente')),  -- Forma de pago con validaciÃ³n
    precio_total DECIMAL(10, 2) NOT NULL,  -- Precio total
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE
);

-- Tabla Reserva: Almacena las reservas de mesas
CREATE TABLE "Reserva" (
    id_reserva SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental
    id_mesa INT NOT NULL,  -- Referencia a la mesa
    documento BIGINT NOT NULL,  -- Referencia al cliente
    id_encab_fact INT,  -- Referencia a la factura
    estado_reserva VARCHAR NOT NULL DEFAULT 'no presentada'
    CHECK (estado_reserva IN (
    'pendiente', 'confirmada', 'en curso', 'finalizada', 'cancelada', 'no presentada')
    ),-- Estado de la reserva con validaciÃ³n
    num_comensales INT NOT NULL DEFAULT 1,  -- numero de personas
    horario TIME NOT NULL,  -- Horario de la reserva
    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),  -- Fecha de la reserva
    motivo_cancelacion VARCHAR(250) NOT NULL DEFAULT 'sin dato',  -- Motivo indicado al cancelar (mÃ¡x 250 caracteres); se envÃ­a al cliente por correo
    ajuste TEXT NOT NULL DEFAULT 'sin dato',  -- Observaciones o ajuste solicitado por el cliente en la reserva
    UNIQUE (id_mesa, fecha, horario),  -- RestricciÃ³n de unicidad para evitar reservas duplicadas
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

COMMENT ON COLUMN "Reserva".motivo_cancelacion IS 'Motivo indicado al cancelar (mÃ¡x 250 caracteres); se envÃ­a al cliente por correo';
COMMENT ON COLUMN "Reserva".ajuste IS 'Observaciones o ajuste solicitado por el cliente en la reserva';

CREATE TABLE "Calculos_mensuales" (
    id_calculo SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental
    nit BIGINT NOT NULL,  -- Referencia al restaurante
    mes INT NOT NULL CHECK (mes >= 1 AND mes <= 12),  -- Mes del cÃ¡lculo
    anio INT NOT NULL CHECK (anio > 0),  -- AÃ±o del cÃ¡lculo
    total_reservas INT NOT NULL DEFAULT 0,  -- Total de reservas del mes
    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- Total facturado del mes
    total_clientes INT NOT NULL DEFAULT 0,  -- Total de clientes del mes
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

CREATE TABLE "Comentarios" (
    id_comentario SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al cliente
    nit BIGINT NOT NULL,  -- Referencia al restaurante
    comentario TEXT NOT NULL,  -- Comentario del cliente
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),  -- Fecha del comentario
    calificacion INT NOT NULL DEFAULT 0 CHECK (calificacion >= 0 AND calificacion <= 5),  -- CalificaciÃ³n del 1 al 5 (0 = sin dato)
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Tabla JWT_Tokens: Una fila por sesiÃ³n. token = access token, refresh_token = token de refresco.
-- Permite renovar el access token sin cerrar sesiÃ³n buscando por refresh_token.
CREATE TABLE "jwt_tokens" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    token TEXT NOT NULL,  -- Access token (se actualiza en cada refresh)
    refresh_token TEXT NOT NULL UNIQUE,  -- Token de refresco; bÃºsqueda por este valor al renovar
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,  -- ExpiraciÃ³n del access token
    refresh_expires_at TIMESTAMP NOT NULL,  -- ExpiraciÃ³n del refresh token
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    user_agent TEXT NOT NULL DEFAULT 'sin dato',
    ip_address TEXT NOT NULL DEFAULT 'sin dato',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_jwt_tokens_refresh_token ON "jwt_tokens" (refresh_token);

-- Tabla Password_Reset_Codes: CÃ³digos temporales para recuperaciÃ³n de contraseÃ±a
CREATE TABLE "Password_Reset_Codes" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_password_reset_codes_credencial ON "Password_Reset_Codes" (id_credencial, used, expires_at);

-- Tabla SMTP_config: ConfiguraciÃ³n por usuario para envÃ­o de correos (cada usuario su correo/contraseÃ±a)
CREATE TABLE "SMTP_config" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL CHECK (port > 0 AND port <= 65535),
    usuario VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(512) NOT NULL DEFAULT 'sin dato',
    from_email VARCHAR(255) NOT NULL,
    consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (id_credencial)
);
COMMENT ON TABLE "SMTP_config" IS 'ConfiguraciÃ³n SMTP por usuario; cada dueÃ±o/admin/empleado tiene su propio correo y contraseÃ±a';

-- Tabla IMAP_config: ConfiguraciÃ³n por usuario para lectura de correos (cada usuario su correo/contraseÃ±a)
CREATE TABLE "IMAP_config" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL CHECK (port > 0 AND port <= 65535),
    usuario VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(512) NOT NULL DEFAULT 'sin dato',
    consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (id_credencial)
);
COMMENT ON TABLE "IMAP_config" IS 'ConfiguraciÃ³n IMAP por usuario; cada dueÃ±o/admin/empleado tiene su propio correo y contraseÃ±a';

-- Tabla Mails: correos archivados desde IMAP (id_credencial = usuario al que le llega el correo)
CREATE TABLE "Mails" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    imap_uid INT NOT NULL,
    from_email VARCHAR(512) NOT NULL,
    to_email VARCHAR(512) NOT NULL DEFAULT 'sin dato',
    subject VARCHAR(1024) NOT NULL,
    snippet VARCHAR(1024) NOT NULL DEFAULT 'sin dato',
    body_text TEXT NOT NULL DEFAULT 'sin dato',
    body_html TEXT NOT NULL DEFAULT 'sin dato',
    date_received TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_mails_credencial_uid ON "Mails" (id_credencial, imap_uid);
CREATE INDEX idx_mails_id_credencial_date ON "Mails" (id_credencial, date_received DESC);
CREATE INDEX idx_mails_date_received ON "Mails" (date_received DESC);
CREATE INDEX idx_mails_created_at ON "Mails" (created_at DESC);
COMMENT ON TABLE "Mails" IS 'Correos electrÃ³nicos archivados desde la bandeja IMAP configurada';

