-- Eliminación de tablas si existen
DROP TABLE IF EXISTS "Reserva" CASCADE;
DROP TABLE IF EXISTS "Detalle_Factura" CASCADE;
DROP TABLE IF EXISTS "Encabezado_Factura" CASCADE;
DROP TABLE IF EXISTS "Empleado" CASCADE;
DROP TABLE IF EXISTS "Cliente" CASCADE;
DROP TABLE IF EXISTS "Restaurante" CASCADE;
DROP TABLE IF EXISTS "Dueño" CASCADE;
DROP TABLE IF EXISTS "Mesas" CASCADE;
DROP TABLE IF EXISTS "Roles" CASCADE;
DROP TABLE IF EXISTS "Credenciales" CASCADE;

-- Tabla de credenciales
CREATE TABLE "Credenciales" (
    id_credencial INT NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 8)
);

-- Tabla de roles
CREATE TABLE "Roles" (
    id_rol INT NOT NULL UNIQUE PRIMARY KEY,
    nombre_rol VARCHAR(15) NOT NULL,
    descripcion VARCHAR(100) NOT NULL
);

-- Tabla de dueño
CREATE TABLE "Dueño" (
    id_dueño INT PRIMARY KEY NOT NULL,
    nombre1 VARCHAR(20) NOT NULL,
    nombre2 VARCHAR(20),
    apellido1 VARCHAR(20) NOT NULL,
    apellido2 VARCHAR(20),
    id_rol INT NOT NULL,
    id_credencial INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol),
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial)
);

-- Tabla de restaurante
CREATE TABLE "Restaurante" (
    NIT INT PRIMARY KEY NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    nombre_restaurante VARCHAR(20) NOT NULL,
    descripcion_restaurante VARCHAR(100) NOT NULL,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    id_dueño INT NOT NULL,
    FOREIGN KEY (id_dueño) REFERENCES "Dueño" (id_dueño),
    CHECK (horario_apertura < horario_cierre)
);

-- Tabla de mesas
CREATE TABLE "Mesas" (
    id_mesa INT PRIMARY KEY NOT NULL,
    estado_de_disponibilidad BOOLEAN NOT NULL,
    cant_personas INT CHECK (cant_personas > 0),
    NIT INT NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL CHECK (Precio >= 0),
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT)
);

-- Tabla de cliente
CREATE TABLE "Cliente" (
    id_cliente INT PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    nombre1 VARCHAR(20) NOT NULL,
    nombre2 VARCHAR(20),
    apellido1 VARCHAR(20) NOT NULL,
    apellido2 VARCHAR(20),
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
    documento BIGINT NOT NULL CHECK (documento > 0),
    nacionalidad VARCHAR(20) NOT NULL,
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol),
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial)
);

-- Tabla de empleado
CREATE TABLE "Empleado" (
    id_empleado INT PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    nombre1 VARCHAR(20) NOT NULL,
    nombre2 VARCHAR(20),
    apellido1 VARCHAR(20) NOT NULL,
    apellido2 VARCHAR(20),
    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
    documento BIGINT NOT NULL CHECK (documento > 0),
    nacionalidad VARCHAR(20) NOT NULL,
    telefono VARCHAR(10) NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),
    id_rol INT NOT NULL,
    NIT INT NOT NULL,
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT),
    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol),
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial)
);

-- Tabla encabezado factura
CREATE TABLE "Encabezado_Factura" (
    id_encab_fact INT PRIMARY KEY NOT NULL,
    NIT INT NOT NULL,
    nombre_restaurante VARCHAR(20) NOT NULL,
    direccion VARCHAR(50) NOT NULL,
    ciudad VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),
    id_cliente INT NOT NULL,
    FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT),
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente)
);

-- Tabla detalle factura
CREATE TABLE "Detalle_Factura" (
    id_det_fact INT PRIMARY KEY NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    unidades INT NOT NULL CHECK (unidades > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    precio_total DECIMAL(10, 2) NOT NULL CHECK (precio_total >= 0),
    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro')),
    id_encab_fact INT NOT NULL,
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact)
);

-- Tabla reserva
CREATE TABLE "Reserva" (
    id_reserva INT PRIMARY KEY NOT NULL,
    id_mesa INT NOT NULL,
    id_cliente INT NOT NULL,
    id_encab_fact INT NOT NULL,
    horario TIME NOT NULL,
    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa),
    FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente),
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact)
);
