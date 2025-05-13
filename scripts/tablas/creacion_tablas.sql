DROP TABLE IF EXISTS "Reserva" CASCADE;
DROP TABLE IF EXISTS "Factura" CASCADE;
DROP TABLE IF EXISTS "Form_Pago" CASCADE;
DROP TABLE IF EXISTS "Empleado" CASCADE;
DROP TABLE IF EXISTS "Cliente" CASCADE;
DROP TABLE IF EXISTS "Restaurante" CASCADE;
DROP TABLE IF EXISTS "Dueño" CASCADE;
DROP TABLE IF EXISTS "Mesas" CASCADE;
DROP TABLE IF EXISTS "Roles" CASCADE;
DROP TABLE IF EXISTS "Credenciales" CASCADE;

CREATE TABLE
    "Credenciales" (
        id_credencial INT NOT NULL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL
    );
CREATE TABLE
    "Roles" (
        id_rol INT NOT NULL PRIMARY KEY,
        nombre_rol VARCHAR(15) NOT NULL,
        descripcion VARCHAR(100) NOT NULL
    );
CREATE TABLE
    "Mesas" (
        id_mesa INT PRIMARY KEY NOT NULL,
        estado_de_disponibilidad BOOLEAN NOT NULL,
        cant_personas INT
    );
CREATE TABLE
    "Dueño" (
        id_dueño INT PRIMARY KEY NOT NULL,
        nombre1 VARCHAR(20) NOT NULL,
        nombre2 VARCHAR(20) NULL,
        apellido1 VARCHAR(20) NOT NULL,
        apellido2 VARCHAR(20) NULL,
        id_rol INT NOT NULL,
        id_credencial INT NOT NULL,
        FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol),
        FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial)
    );
CREATE TABLE
    "Restaurante" (
        NIT INT PRIMARY KEY NOT NULL,
        direccion VARCHAR(50) NOT NULL,
        nombre_restaurante VARCHAR(20) NOT NULL,
        descripcion_restaurante VARCHAR(100) NOT NULL,
        horario_apertura TIME NOT NULL,
        horario_cierre TIME NOT NULL,
        id_dueño INT NOT NULL,
        FOREIGN KEY (id_dueño) REFERENCES "Dueño" (id_dueño)
    );
CREATE TABLE
    "Cliente" (
        id_cliente INT NOT NULL PRIMARY KEY,
        id_credencial INT NOT NULL,
        nombre1 VARCHAR(20) NOT NULL,
        nombre2 VARCHAR(20),
        apellido1 VARCHAR(20) NOT NULL,
        apellido2 VARCHAR(20),
        tipo_documento VARCHAR(15) NOT NULL,
        documento INT NOT NULL,
        nacionalidad VARCHAR(20) NOT NULL,
        telefono VARCHAR(10) NOT NULL,
        id_rol INT NOT NULL,
        FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol),
        FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial)
    );
CREATE TABLE
    "Empleado" (
        id_empleado INT NOT NULL PRIMARY KEY,
        id_credencial INT NOT NULL,
        nombre1 VARCHAR(20) NOT NULL,
        nombre2 VARCHAR(20),
        apellido1 VARCHAR(20) NOT NULL,
        apellido2 VARCHAR(20),
        tipo_documento VARCHAR(15) NOT NULL,
        documento INT NOT NULL,
        nacionalidad VARCHAR(20) NOT NULL,
        telefono VARCHAR(10) NOT NULL,
        id_rol INT NOT NULL,
        NIT INT NOT NULL,
        FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT),
        FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol),
        FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial)
    );
CREATE TABLE
    "Form_Pago" (
        id_form_pago INT PRIMARY KEY NOT NULL,
        form_pago VARCHAR NOT NULL,
        numero_tarjeta INT NOT NULL,
        CVV INT NOT NULL,
        nombre_cliente VARCHAR NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        id_cliente INT NOT NULL,
        FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente)
    );
CREATE TABLE
    "Factura" (
        id_factura INT PRIMARY KEY NOT NULL,
        NIT INT NOT NULL,
        nombre_restaurante VARCHAR(20) NOT NULL,
        direccion VARCHAR(50) NOT NULL,
        ciudad VARCHAR(20) NOT NULL,
        productos VARCHAR(50) NOT NULL,
        unidades INT NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        precio_total DECIMAL(10, 2) NOT NULL,
        id_form_pago INT NOT NULL,
        FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT),
        FOREIGN KEY (id_form_pago) REFERENCES "Form_Pago" (id_form_pago)
    );
CREATE TABLE
    "Reserva" (
        id_reserva INT PRIMARY KEY NOT NULL,
        id_mesa INT NOT NULL,
        id_cliente INT NOT NULL,
        NIT INT NOT NULL,
        id_factura INT NOT NULL,
        horario TIME NOT NULL,
        fecha DATE NOT NULL,
        FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa),
        FOREIGN KEY (id_cliente) REFERENCES "Cliente" (id_cliente),
        FOREIGN KEY (NIT) REFERENCES "Restaurante" (NIT),
        FOREIGN KEY (id_factura) REFERENCES "Factura" (id_factura)
    );