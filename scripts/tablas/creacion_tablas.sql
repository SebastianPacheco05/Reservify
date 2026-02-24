/*
 * Script de creación de base de datos para el sistema de reservas de restaurantes
 * Este script crea todas las tablas necesarias para el funcionamiento del sistema
 * Incluye la eliminación de tablas existentes y la creación de nuevas con sus respectivas relaciones
 */

-- Primero se eliminan todas las tablas existentes en orden inverso a su creación
-- para evitar problemas de dependencias
DROP TABLE IF EXISTS "SMTP_config";
DROP TABLE IF EXISTS "IMAP_config";
DROP TABLE IF EXISTS "Reserva";
DROP TABLE IF EXISTS "Encabezado_Factura";
DROP TABLE IF EXISTS "Comentarios";
DROP TABLE IF EXISTS "Mesas";
DROP TABLE IF EXISTS "Calculos_mensuales";
DROP TABLE IF EXISTS "Imagen_referencia_restaurante";
DROP TABLE IF EXISTS "Restaurante";
DROP TABLE IF EXISTS "Usuario";
DROP TABLE IF EXISTS "Roles";
DROP TABLE IF EXISTS "jwt_tokens";
DROP TABLE IF EXISTS "Credenciales";
DROP TABLE IF EXISTS "Categorias";


-- Tabla Credenciales: Almacena la información de autenticación de usuarios
CREATE TABLE "Credenciales" (
    id_credencial SERIAL NOT NULL PRIMARY KEY,  -- Identificador único autoincremental
    email VARCHAR(100) NOT NULL UNIQUE CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND 
        length(email) <= 100
    ),  -- Email único con validación de formato (solo caracteres ASCII, sin Unicode)
    password VARCHAR(255) NOT NULL  -- Contraseña encriptada
);

-- Tabla Roles: Define los diferentes roles en el sistema
CREATE TABLE "Roles" (
    id_rol SERIAL NOT NULL UNIQUE PRIMARY KEY,  -- Identificador único autoincremental
    nombre_rol VARCHAR(15) NOT NULL,  -- Nombre del rol
    descripcion VARCHAR(100) NOT NULL  -- Descripción del rol
);

-- Tabla Usuario: Almacena todos los usuarios del sistema (cliente, dueño, empleado) según id_rol
-- Dueño: vinculado a restaurantes por Restaurante.documento = Usuario.documento
-- Empleado: vinculado a un restaurante por Usuario.nit (restaurante donde trabaja)
CREATE TABLE "Usuario" (
    documento DECIMAL(10, 0) PRIMARY KEY NOT NULL CHECK (documento > 0),
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    id_rol INT NOT NULL,
    id_credencial INT NOT NULL UNIQUE,
    nacionalidad VARCHAR(20),
    telefono VARCHAR(10) CHECK (telefono IS NULL OR telefono ~ '^[0-9]{10}$'),
    nit DECIMAL(10, 0) NULL,  -- Solo para rol empleado: restaurante donde trabaja; dueño se vincula por Restaurante.documento
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
    -- Antelación mínima en horas para crear una reserva (0 = sin restricción).
    -- Ej: 24 = al menos 1 día antes, 2 = al menos 2 horas antes.
    min_anticipacion_horas INT NOT NULL DEFAULT 0 CHECK (min_anticipacion_horas >= 0),
    lat DOUBLE PRECISION,  -- Latitud para mostrar el restaurante en el mapa
    lng DOUBLE PRECISION,  -- Longitud para mostrar el restaurante en el mapa
    foreign key (id_categoria) references "Categorias" (id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,
    CHECK (horario_apertura < horario_cierre)  -- Validación de horarios
);

-- FK de Usuario.nit a Restaurante (después de crear Restaurante para evitar dependencia circular)
ALTER TABLE "Usuario" ADD CONSTRAINT fk_usuario_nit_restaurante
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE SET NULL;

-- Tabla Imagen_referencia_restaurante: Almacena imágenes de referencia de restaurantes (máximo 15 por NIT)
CREATE TABLE "Imagen_referencia_restaurante" (
    nit DECIMAL(10, 0) NOT NULL,
    url_imagen VARCHAR NOT NULL,
    orden INT NOT NULL DEFAULT 0 CHECK (orden >= 0 AND orden < 15),
    PRIMARY KEY (nit, orden),
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Crear índice para búsquedas rápidas por NIT
CREATE INDEX idx_imagen_ref_nit ON "Imagen_referencia_restaurante" (nit);

-- Trigger para limitar a 15 imágenes por restaurante
CREATE OR REPLACE FUNCTION verificar_max_imagenes_referencia()
RETURNS TRIGGER AS $$
DECLARE
    total_imagenes INT;
BEGIN
    SELECT COUNT(*) INTO total_imagenes
    FROM "Imagen_referencia_restaurante"
    WHERE nit = NEW.nit;
    
    IF total_imagenes >= 15 THEN
        RAISE EXCEPTION 'Máximo 15 imágenes de referencia por restaurante';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para limitar imágenes de referencia
CREATE TRIGGER trigger_max_imagenes_ref
    BEFORE INSERT ON "Imagen_referencia_restaurante"
    FOR EACH ROW
    EXECUTE FUNCTION verificar_max_imagenes_referencia();

-- Comentarios para documentación
COMMENT ON TABLE "Imagen_referencia_restaurante" IS 'Almacena imágenes de referencia de restaurantes (máximo 15 por NIT)';
COMMENT ON COLUMN "Imagen_referencia_restaurante".nit IS 'NIT del restaurante';
COMMENT ON COLUMN "Imagen_referencia_restaurante".url_imagen IS 'URL de la imagen (Cloudinary)';
COMMENT ON COLUMN "Imagen_referencia_restaurante".orden IS 'Orden de la imagen (0-14)';

-- Tabla Mesas: Almacena información de las mesas de cada restaurante
CREATE TABLE "Mesas" (
    id_mesa SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    estado_de_disponibilidad BOOLEAN NOT NULL,  -- Estado de disponibilidad
    cant_personas INT CHECK (cant_personas > 0),  -- Capacidad de personas
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),  -- Precio de la mesa
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE
);

-- Tabla Encabezado_Factura: Almacena la información principal de las facturas
CREATE TABLE "Encabezado_Factura" (
    id_encab_fact SERIAL PRIMARY KEY NOT NULL,  -- Identificador único autoincremental
    nit DECIMAL(10, 0) NOT NULL,  -- Referencia al restaurante
    nombre_restaurante VARCHAR(255) NOT NULL,  -- Nombre del restaurante
    direccion VARCHAR(255) NOT NULL,  -- Dirección del restaurante (ej. Nominatim)
    ciudad VARCHAR(255) NOT NULL,  -- Ciudad
    fecha DATE NOT NULL CHECK (fecha = CURRENT_DATE),  -- Fecha de la factura
    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al cliente
    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro', 'Pendiente')),  -- Forma de pago con validación
    precio_total DECIMAL(10, 2) NOT NULL,  -- Precio total
    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE
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
    motivo_cancelacion VARCHAR(250),  -- Motivo indicado al cancelar (máx 250 caracteres); se envía al cliente por correo
    ajuste TEXT,  -- Observaciones o ajuste solicitado por el cliente en la reserva
    UNIQUE (id_mesa, fecha, horario),  -- Restricción de unicidad para evitar reservas duplicadas
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa) ON DELETE CASCADE,
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

COMMENT ON COLUMN "Reserva".motivo_cancelacion IS 'Motivo indicado al cancelar (máx 250 caracteres); se envía al cliente por correo';
COMMENT ON COLUMN "Reserva".ajuste IS 'Observaciones o ajuste solicitado por el cliente en la reserva';

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
    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,
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

-- Tabla SMTP_config: Configuración por usuario para envío de correos (cada usuario su correo/contraseña)
CREATE TABLE "SMTP_config" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL CHECK (port > 0 AND port <= 65535),
    usuario VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(512),
    from_email VARCHAR(255) NOT NULL,
    consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (id_credencial)
);
COMMENT ON TABLE "SMTP_config" IS 'Configuración SMTP por usuario; cada dueño/admin/empleado tiene su propio correo y contraseña';

-- Tabla IMAP_config: Configuración por usuario para lectura de correos (cada usuario su correo/contraseña)
CREATE TABLE "IMAP_config" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL CHECK (port > 0 AND port <= 65535),
    usuario VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(512),
    consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (id_credencial)
);
COMMENT ON TABLE "IMAP_config" IS 'Configuración IMAP por usuario; cada dueño/admin/empleado tiene su propio correo y contraseña';

-- Tabla Mails: correos archivados desde IMAP (id_credencial = usuario al que le llega el correo)
CREATE TABLE "Mails" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,
    imap_uid INT NOT NULL,
    from_email VARCHAR(512) NOT NULL,
    to_email VARCHAR(512),
    subject VARCHAR(1024) NOT NULL,
    snippet VARCHAR(1024),
    body_text TEXT,
    body_html TEXT,
    date_received TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_mails_credencial_uid ON "Mails" (id_credencial, imap_uid);
CREATE INDEX idx_mails_id_credencial_date ON "Mails" (id_credencial, date_received DESC);
CREATE INDEX idx_mails_date_received ON "Mails" (date_received DESC);
CREATE INDEX idx_mails_created_at ON "Mails" (created_at DESC);
COMMENT ON TABLE "Mails" IS 'Correos electrónicos archivados desde la bandeja IMAP configurada';

-- Función y trigger: actualizar updated_at en SMTP_config
CREATE OR REPLACE FUNCTION actualizar_updated_at_smtp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_smtp_updated_at
    BEFORE UPDATE ON "SMTP_config"
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at_smtp();

-- Función y trigger: actualizar updated_at en IMAP_config
CREATE OR REPLACE FUNCTION actualizar_updated_at_imap()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_imap_updated_at
    BEFORE UPDATE ON "IMAP_config"
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at_imap();

-- Función y trigger: Validar que los administradores siempre tengan un restaurante asignado (nit NOT NULL)
CREATE OR REPLACE FUNCTION validar_admin_tiene_restaurante()
RETURNS TRIGGER AS $$
DECLARE
    v_nombre_rol VARCHAR(15);
BEGIN
    -- Obtener el nombre del rol
    SELECT nombre_rol INTO v_nombre_rol
    FROM "Roles"
    WHERE id_rol = NEW.id_rol;
    
    -- Si es administrador, nit debe ser NOT NULL
    IF LOWER(TRIM(v_nombre_rol)) = 'administrador' AND NEW.nit IS NULL THEN
        RAISE EXCEPTION 'Un administrador debe estar vinculado a un restaurante (nit no puede ser NULL)';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger antes de INSERT o UPDATE en Usuario
CREATE TRIGGER trigger_validar_admin_restaurante
    BEFORE INSERT OR UPDATE ON "Usuario"
    FOR EACH ROW
    EXECUTE FUNCTION validar_admin_tiene_restaurante();

COMMENT ON FUNCTION validar_admin_tiene_restaurante() IS 'Valida que los administradores siempre tengan un restaurante asignado (nit NOT NULL)';

