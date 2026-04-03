# Documentacion linea por linea de `db/creacion_tablas.sql`

- Archivo origen: `db/creacion_tablas.sql`
- Metodo: explicacion literal por linea (incluye lineas vacias).

| Linea | Codigo | Explicacion |
|---:|---|---|
| 001 | `/*` | Inicio de comentario multilinea de encabezado. |
| 002 | ` * Script de creaciÃ³n de base de datos para el sistema de reservas de restaurantes` | Linea SQL de soporte del bloque actual. |
| 003 | ` * Este script crea todas las tablas necesarias para el funcionamiento del sistema` | Linea SQL de soporte del bloque actual. |
| 004 | ` * Incluye la eliminaciÃ³n de tablas existentes y la creaciÃ³n de nuevas con sus respectivas relaciones` | Linea SQL de soporte del bloque actual. |
| 005 | ` */` | Cierre del comentario multilinea. |
| 006 | _(vacia)_ | Separador visual entre bloques SQL. |
| 007 | `-- Primero se eliminan todas las tablas existentes en orden inverso a su creaciÃ³n` | Comentario descriptivo del bloque siguiente. |
| 008 | `-- para evitar problemas de dependencias` | Comentario descriptivo del bloque siguiente. |
| 009 | `DROP TABLE IF EXISTS "Reserva";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 010 | `DROP TABLE IF EXISTS "Comentarios";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 011 | `DROP TABLE IF EXISTS "Calculos_mensuales";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 012 | `DROP TABLE IF EXISTS "Imagen_referencia_restaurante";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 013 | `DROP TABLE IF EXISTS "Mesas";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 014 | `DROP TABLE IF EXISTS "Administrador_restaurante";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 015 | `DROP TABLE IF EXISTS "Encabezado_Factura";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 016 | `DROP TABLE IF EXISTS "Restaurante";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 017 | `DROP TABLE IF EXISTS "Mails";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 018 | `DROP TABLE IF EXISTS "IMAP_config";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 019 | `DROP TABLE IF EXISTS "SMTP_config";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 020 | `DROP TABLE IF EXISTS "Password_Reset_Codes";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 021 | `DROP TABLE IF EXISTS "jwt_tokens";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 022 | `DROP TABLE IF EXISTS "Usuario";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 023 | `DROP TABLE IF EXISTS "Categorias";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 024 | `DROP TABLE IF EXISTS "Roles";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 025 | `DROP TABLE IF EXISTS "Credenciales";` | Elimina la tabla indicada solo si existe (reinicio seguro del esquema). |
| 026 | _(vacia)_ | Separador visual entre bloques SQL. |
| 027 | `-- Extensión para generar UUID aleatorio con gen_random_uuid()` | Comentario descriptivo del bloque siguiente. |
| 028 | `CREATE EXTENSION IF NOT EXISTS pgcrypto;` | Habilita extension requerida por el esquema (idempotente). |
| 029 | _(vacia)_ | Separador visual entre bloques SQL. |
| 030 | _(vacia)_ | Separador visual entre bloques SQL. |
| 031 | `-- Tabla Credenciales: Almacena la informaciÃ³n de autenticaciÃ³n de usuarios` | Comentario descriptivo del bloque siguiente. |
| 032 | `CREATE TABLE "Credenciales" (` | Inicia la definicion de una nueva tabla. |
| 033 | `    id_credencial SERIAL NOT NULL PRIMARY KEY,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 034 | `    email VARCHAR(100) NOT NULL UNIQUE CHECK (` | Linea SQL de soporte del bloque actual. |
| 035 | `        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND ` | Linea SQL de soporte del bloque actual. |
| 036 | `        length(email) <= 100` | Linea SQL de soporte del bloque actual. |
| 037 | `    ),  -- Email Ãºnico con validaciÃ³n de formato (solo caracteres ASCII, sin Unicode)` | Forma parte de una restriccion/condicion del esquema. |
| 038 | `    password VARCHAR(255) NOT NULL  -- ContraseÃ±a encriptada` | Define una columna (tipo, restricciones y/o comentario inline). |
| 039 | `);` | Cierra la definicion del objeto SQL actual. |
| 040 | _(vacia)_ | Separador visual entre bloques SQL. |
| 041 | `-- Tabla Roles: Define los diferentes roles en el sistema` | Comentario descriptivo del bloque siguiente. |
| 042 | `CREATE TABLE "Roles" (` | Inicia la definicion de una nueva tabla. |
| 043 | `    id_rol SERIAL NOT NULL UNIQUE PRIMARY KEY,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 044 | `    nombre_rol VARCHAR(15) NOT NULL,  -- Nombre del rol` | Define una columna (tipo, restricciones y/o comentario inline). |
| 045 | `    descripcion VARCHAR(100) NOT NULL  -- DescripciÃ³n del rol` | Define una columna (tipo, restricciones y/o comentario inline). |
| 046 | `);` | Cierra la definicion del objeto SQL actual. |
| 047 | _(vacia)_ | Separador visual entre bloques SQL. |
| 048 | `-- Roles iniciales del sistema` | Comentario descriptivo del bloque siguiente. |
| 049 | `INSERT INTO "Roles" (id_rol, nombre_rol, descripcion) VALUES` | Inserta datos semilla iniciales. |
| 050 | `    (1, 'dueÃ±o', 'Propietario de uno o mÃ¡s restaurantes'),` | Linea SQL de soporte del bloque actual. |
| 051 | `    (2, 'cliente', 'Usuario que realiza reservas en restaurantes'),` | Linea SQL de soporte del bloque actual. |
| 052 | `    (3, 'empleado', 'Trabajador vinculado a un restaurante'),` | Linea SQL de soporte del bloque actual. |
| 053 | `    (4, 'administrador', 'Administrador general de varios restaurantes')` | Linea SQL de soporte del bloque actual. |
| 054 | `ON CONFLICT (id_rol) DO NOTHING;` | Evita error por duplicado en insercion repetida. |
| 055 | _(vacia)_ | Separador visual entre bloques SQL. |
| 056 | `-- Tabla Usuario: Almacena todos los usuarios del sistema (cliente, dueÃ±o, empleado) segÃºn id_rol` | Comentario descriptivo del bloque siguiente. |
| 057 | `-- DueÃ±o: vinculado a restaurantes por Restaurante.documento = Usuario.documento` | Comentario descriptivo del bloque siguiente. |
| 058 | `-- Empleado: vinculado a un restaurante por Usuario.nit (restaurante donde trabaja)` | Comentario descriptivo del bloque siguiente. |
| 059 | `-- Administrador: vinculado por tabla puente Administrador_restaurante` | Comentario descriptivo del bloque siguiente. |
| 060 | `CREATE TABLE "Usuario" (` | Inicia la definicion de una nueva tabla. |
| 061 | `    documento DECIMAL(10, 0) PRIMARY KEY NOT NULL CHECK (documento > 0),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 062 | `    tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 063 | `    nombre VARCHAR(50) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 064 | `    apellido VARCHAR(50) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 065 | `    id_rol INT NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 066 | `    id_credencial INT NOT NULL UNIQUE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 067 | `    nacionalidad VARCHAR(20) NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 068 | `    telefono VARCHAR(10) NOT NULL DEFAULT 'sin dato' CHECK (telefono ~ '^[0-9]{10}$'),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 069 | `    nit BIGINT NULL CHECK (nit > 8999999999 AND nit <= 99999999999),  -- Solo para rol empleado; administradores usan tabla puente` | Define una columna (tipo, restricciones y/o comentario inline). |
| 070 | `    FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 071 | `    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 072 | `);` | Cierra la definicion del objeto SQL actual. |
| 073 | _(vacia)_ | Separador visual entre bloques SQL. |
| 074 | `-- Tabla Categorias: Define las categorÃ­as de restaurantes` | Comentario descriptivo del bloque siguiente. |
| 075 | `CREATE TABLE "Categorias" (` | Inicia la definicion de una nueva tabla. |
| 076 | `    id_categoria SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 077 | `    nombre_categoria varchar NOT NULL  -- Nombre de la categorÃ­a` | Define una columna (tipo, restricciones y/o comentario inline). |
| 078 | `);` | Cierra la definicion del objeto SQL actual. |
| 079 | _(vacia)_ | Separador visual entre bloques SQL. |
| 080 | `-- Tabla Restaurante: Almacena informaciÃ³n de los restaurantes` | Comentario descriptivo del bloque siguiente. |
| 081 | `CREATE TABLE "Restaurante" (` | Inicia la definicion de una nueva tabla. |
| 082 | `    restaurante_uid UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),  -- identificador aleatorio real del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 083 | `    nit BIGINT UNIQUE NOT NULL,  -- identificador de negocio (NIT), ya no es PK` | Define una columna (tipo, restricciones y/o comentario inline). |
| 084 | `    direccion VARCHAR(255) NOT NULL,  -- DirecciÃ³n del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 085 | `    nombre_restaurante VARCHAR(50) NOT NULL,  -- Nombre del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 086 | `    descripcion_restaurante VARCHAR(100) NOT NULL,  -- DescripciÃ³n del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 087 | `    rating DECIMAL(2, 1) NOT NULL,  -- Rating del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 088 | `    reviews INT NOT NULL,  -- Reviews del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 089 | `    availableToday BOOLEAN NOT NULL,  -- Disponibilidad del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 090 | `    horario_apertura TIME NOT NULL,  -- Hora de apertura` | Define una columna (tipo, restricciones y/o comentario inline). |
| 091 | `    horario_cierre TIME NOT NULL,  -- Hora de cierre` | Define una columna (tipo, restricciones y/o comentario inline). |
| 092 | `    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al dueÃ±o` | Define una columna (tipo, restricciones y/o comentario inline). |
| 093 | `    id_categoria INT not null,  -- Referencia a la categorÃ­a` | Define una columna (tipo, restricciones y/o comentario inline). |
| 094 | `    url_image VARCHAR NOT NULL,  -- URL de la imagen del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 095 | `    -- AntelaciÃ³n mÃ­nima en horas para crear una reserva (0 = sin restricciÃ³n).` | Comentario descriptivo del bloque siguiente. |
| 096 | `    -- Ej: 24 = al menos 1 dÃ­a antes, 2 = al menos 2 horas antes.` | Comentario descriptivo del bloque siguiente. |
| 097 | `    min_anticipacion_horas INT NOT NULL DEFAULT 0 CHECK (min_anticipacion_horas >= 0),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 098 | `    lat DOUBLE PRECISION NOT NULL DEFAULT 0,  -- Latitud para mostrar el restaurante en el mapa (0 = sin dato)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 099 | `    lng DOUBLE PRECISION NOT NULL DEFAULT 0,  -- Longitud para mostrar el restaurante en el mapa (0 = sin dato)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 100 | `    foreign key (id_categoria) references "Categorias" (id_categoria) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 101 | `    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 102 | `    CHECK (` | Forma parte de una restriccion/condicion del esquema. |
| 103 | `        horario_apertura <> horario_cierre` | Linea SQL de soporte del bloque actual. |
| 104 | `        AND (` | Forma parte de una restriccion/condicion del esquema. |
| 105 | `            horario_apertura < horario_cierre` | Linea SQL de soporte del bloque actual. |
| 106 | `            OR (` | Forma parte de una restriccion/condicion del esquema. |
| 107 | `                horario_apertura > horario_cierre` | Linea SQL de soporte del bloque actual. |
| 108 | `                AND ((horario_cierre + INTERVAL '24 hours') - horario_apertura) <= INTERVAL '8 hours'` | Forma parte de una restriccion/condicion del esquema. |
| 109 | `            )` | Forma parte de una restriccion/condicion del esquema. |
| 110 | `        )` | Forma parte de una restriccion/condicion del esquema. |
| 111 | `    )  -- Permite cruce de medianoche con máximo 8 horas` | Forma parte de una restriccion/condicion del esquema. |
| 112 | `);` | Cierra la definicion del objeto SQL actual. |
| 113 | _(vacia)_ | Separador visual entre bloques SQL. |
| 114 | `-- Tabla Administrador_restaurante: relación administrador <-> restaurante` | Comentario descriptivo del bloque siguiente. |
| 115 | `-- Un administrador puede gestionar múltiples restaurantes; cada restaurante tiene un único administrador.` | Comentario descriptivo del bloque siguiente. |
| 116 | `CREATE TABLE "Administrador_restaurante" (` | Inicia la definicion de una nueva tabla. |
| 117 | `    id_credencial INT NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 118 | `    restaurante_uid UUID NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 119 | `    PRIMARY KEY (id_credencial, restaurante_uid),` | Define llave primaria del registro. |
| 120 | `    UNIQUE (restaurante_uid),` | Impone unicidad en el/los campo(s) indicados. |
| 121 | `    FOREIGN KEY (id_credencial) REFERENCES "Usuario" (id_credencial) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 122 | `    FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 123 | `);` | Cierra la definicion del objeto SQL actual. |
| 124 | _(vacia)_ | Separador visual entre bloques SQL. |
| 125 | `CREATE INDEX idx_admin_restaurante_id_credencial ON "Administrador_restaurante" (id_credencial);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 126 | `CREATE INDEX idx_admin_restaurante_uid ON "Administrador_restaurante" (restaurante_uid);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 127 | _(vacia)_ | Separador visual entre bloques SQL. |
| 128 | `COMMENT ON TABLE "Administrador_restaurante" IS 'Relación administrador-restaurante (admin multi-local, un admin por restaurante).';` | Documenta metadatos del esquema en PostgreSQL. |
| 129 | _(vacia)_ | Separador visual entre bloques SQL. |
| 130 | `-- Tabla Imagen_referencia_restaurante: imÃ¡genes de referencia por restaurante (mÃ¡ximo 15 por restaurante_uid)` | Comentario descriptivo del bloque siguiente. |
| 131 | `CREATE TABLE "Imagen_referencia_restaurante" (` | Inicia la definicion de una nueva tabla. |
| 132 | `    restaurante_uid UUID NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 133 | `    url_imagen VARCHAR NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 134 | `    orden INT NOT NULL DEFAULT 0 CHECK (orden >= 0 AND orden < 15),` | Forma parte de una restriccion/condicion del esquema. |
| 135 | `    PRIMARY KEY (restaurante_uid, orden),` | Define llave primaria del registro. |
| 136 | `    FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 137 | `);` | Cierra la definicion del objeto SQL actual. |
| 138 | _(vacia)_ | Separador visual entre bloques SQL. |
| 139 | `CREATE INDEX idx_imagen_ref_restaurante_uid ON "Imagen_referencia_restaurante" (restaurante_uid);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 140 | _(vacia)_ | Separador visual entre bloques SQL. |
| 141 | `COMMENT ON TABLE "Imagen_referencia_restaurante" IS 'ImÃ¡genes de referencia por restaurante (PK restaurante_uid + orden; mÃ¡x. 15)';` | Documenta metadatos del esquema en PostgreSQL. |
| 142 | `COMMENT ON COLUMN "Imagen_referencia_restaurante".restaurante_uid IS 'FK al restaurante (UUID)';` | Documenta metadatos del esquema en PostgreSQL. |
| 143 | `COMMENT ON COLUMN "Imagen_referencia_restaurante".url_imagen IS 'URL de la imagen (Cloudinary)';` | Documenta metadatos del esquema en PostgreSQL. |
| 144 | `COMMENT ON COLUMN "Imagen_referencia_restaurante".orden IS 'Orden de la imagen (0-14)';` | Documenta metadatos del esquema en PostgreSQL. |
| 145 | _(vacia)_ | Separador visual entre bloques SQL. |
| 146 | `-- Tabla Mesas: Almacena informaciÃ³n de las mesas de cada restaurante` | Comentario descriptivo del bloque siguiente. |
| 147 | `CREATE TABLE "Mesas" (` | Inicia la definicion de una nueva tabla. |
| 148 | `    id_mesa SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 149 | `    estado_de_disponibilidad BOOLEAN NOT NULL,  -- Estado de disponibilidad` | Define una columna (tipo, restricciones y/o comentario inline). |
| 150 | `    cant_personas INT NOT NULL CHECK (cant_personas > 0),  -- Capacidad de personas` | Define una columna (tipo, restricciones y/o comentario inline). |
| 151 | `    nit BIGINT NOT NULL,  -- Referencia al restaurante (NIT de negocio)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 152 | `    restaurante_uid UUID NOT NULL,  -- Misma fila que Restaurante.restaurante_uid (evita ambigÃ¼edad en APIs)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 153 | `    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),  -- Precio de la mesa` | Define una columna (tipo, restricciones y/o comentario inline). |
| 154 | `    descripcion VARCHAR(255) NOT NULL DEFAULT 'sin dato',  -- DescripciÃ³n de la mesa` | Define una columna (tipo, restricciones y/o comentario inline). |
| 155 | `    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 156 | `    FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 157 | `);` | Cierra la definicion del objeto SQL actual. |
| 158 | _(vacia)_ | Separador visual entre bloques SQL. |
| 159 | `-- Tabla Encabezado_Factura: Almacena la informaciÃ³n principal de las facturas` | Comentario descriptivo del bloque siguiente. |
| 160 | `CREATE TABLE "Encabezado_Factura" (` | Inicia la definicion de una nueva tabla. |
| 161 | `    id_encab_fact SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 162 | `    nit BIGINT NOT NULL,  -- Referencia al restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 163 | `    nombre_restaurante VARCHAR(255) NOT NULL,  -- Nombre del restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 164 | `    direccion VARCHAR(255) NOT NULL,  -- DirecciÃ³n del restaurante (ej. Nominatim)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 165 | `    ciudad VARCHAR(255) NOT NULL,  -- Ciudad` | Define una columna (tipo, restricciones y/o comentario inline). |
| 166 | `    fecha DATE NOT NULL CHECK (` | Linea SQL de soporte del bloque actual. |
| 167 | `        fecha >= CURRENT_DATE - INTERVAL '1 day'` | Linea SQL de soporte del bloque actual. |
| 168 | `        AND fecha <= CURRENT_DATE + INTERVAL '1 day'` | Forma parte de una restriccion/condicion del esquema. |
| 169 | `    ),  -- Fecha de la factura (permite pequeÃ±as diferencias de zona horaria)` | Forma parte de una restriccion/condicion del esquema. |
| 170 | `    documento BIGINT NOT NULL,  -- Referencia al cliente` | Define una columna (tipo, restricciones y/o comentario inline). |
| 171 | `    forma_pago VARCHAR(50) NOT NULL CHECK (forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro', 'Pendiente')),  -- Forma de pago con validaciÃ³n` | Define una columna (tipo, restricciones y/o comentario inline). |
| 172 | `    precio_total DECIMAL(10, 2) NOT NULL,  -- Precio total` | Define una columna (tipo, restricciones y/o comentario inline). |
| 173 | `    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 174 | `    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 175 | `);` | Cierra la definicion del objeto SQL actual. |
| 176 | _(vacia)_ | Separador visual entre bloques SQL. |
| 177 | `-- Tabla Reserva: Almacena las reservas de mesas` | Comentario descriptivo del bloque siguiente. |
| 178 | `CREATE TABLE "Reserva" (` | Inicia la definicion de una nueva tabla. |
| 179 | `    id_reserva SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 180 | `    id_mesa INT NOT NULL,  -- Referencia a la mesa` | Define una columna (tipo, restricciones y/o comentario inline). |
| 181 | `    documento BIGINT NOT NULL,  -- Referencia al cliente` | Define una columna (tipo, restricciones y/o comentario inline). |
| 182 | `    id_encab_fact INT,  -- Referencia a la factura` | Define una columna (tipo, restricciones y/o comentario inline). |
| 183 | `    estado_reserva VARCHAR NOT NULL DEFAULT 'no presentada'` | Linea SQL de soporte del bloque actual. |
| 184 | `    CHECK (estado_reserva IN (` | Forma parte de una restriccion/condicion del esquema. |
| 185 | `    'pendiente', 'confirmada', 'en curso', 'finalizada', 'cancelada', 'no presentada')` | Linea SQL de soporte del bloque actual. |
| 186 | `    ),-- Estado de la reserva con validaciÃ³n` | Forma parte de una restriccion/condicion del esquema. |
| 187 | `    num_comensales INT NOT NULL DEFAULT 1,  -- numero de personas` | Define una columna (tipo, restricciones y/o comentario inline). |
| 188 | `    horario TIME NOT NULL,  -- Horario de la reserva` | Define una columna (tipo, restricciones y/o comentario inline). |
| 189 | `    fecha DATE NOT NULL CHECK (fecha >= CURRENT_DATE),  -- Fecha de la reserva` | Define una columna (tipo, restricciones y/o comentario inline). |
| 190 | `    motivo_cancelacion VARCHAR(250) NOT NULL DEFAULT 'sin dato',  -- Motivo indicado al cancelar (mÃ¡x 250 caracteres); se envÃ­a al cliente por correo` | Define una columna (tipo, restricciones y/o comentario inline). |
| 191 | `    ajuste TEXT NOT NULL DEFAULT 'sin dato',  -- Observaciones o ajuste solicitado por el cliente en la reserva` | Define una columna (tipo, restricciones y/o comentario inline). |
| 192 | `    UNIQUE (id_mesa, fecha, horario),  -- RestricciÃ³n de unicidad para evitar reservas duplicadas` | Impone unicidad en el/los campo(s) indicados. |
| 193 | `    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 194 | `    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 195 | `    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 196 | `);` | Cierra la definicion del objeto SQL actual. |
| 197 | _(vacia)_ | Separador visual entre bloques SQL. |
| 198 | `COMMENT ON COLUMN "Reserva".motivo_cancelacion IS 'Motivo indicado al cancelar (mÃ¡x 250 caracteres); se envÃ­a al cliente por correo';` | Documenta metadatos del esquema en PostgreSQL. |
| 199 | `COMMENT ON COLUMN "Reserva".ajuste IS 'Observaciones o ajuste solicitado por el cliente en la reserva';` | Documenta metadatos del esquema en PostgreSQL. |
| 200 | _(vacia)_ | Separador visual entre bloques SQL. |
| 201 | `CREATE TABLE "Calculos_mensuales" (` | Inicia la definicion de una nueva tabla. |
| 202 | `    id_calculo SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 203 | `    nit BIGINT NOT NULL,  -- Referencia al restaurante` | Define una columna (tipo, restricciones y/o comentario inline). |
| 204 | `    mes INT NOT NULL CHECK (mes >= 1 AND mes <= 12),  -- Mes del cÃ¡lculo` | Define una columna (tipo, restricciones y/o comentario inline). |
| 205 | `    anio INT NOT NULL CHECK (anio > 0),  -- AÃ±o del cÃ¡lculo` | Define una columna (tipo, restricciones y/o comentario inline). |
| 206 | `    total_reservas INT NOT NULL DEFAULT 0,  -- Total de reservas del mes` | Define una columna (tipo, restricciones y/o comentario inline). |
| 207 | `    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- Total facturado del mes` | Define una columna (tipo, restricciones y/o comentario inline). |
| 208 | `    total_clientes INT NOT NULL DEFAULT 0,  -- Total de clientes del mes` | Define una columna (tipo, restricciones y/o comentario inline). |
| 209 | `    FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 210 | `);` | Cierra la definicion del objeto SQL actual. |
| 211 | _(vacia)_ | Separador visual entre bloques SQL. |
| 212 | `CREATE TABLE "Comentarios" (` | Inicia la definicion de una nueva tabla. |
| 213 | `    id_comentario SERIAL PRIMARY KEY NOT NULL,  -- Identificador Ãºnico autoincremental` | Define una columna (tipo, restricciones y/o comentario inline). |
| 214 | `    documento DECIMAL(10, 0) NOT NULL,  -- Referencia al cliente` | Define una columna (tipo, restricciones y/o comentario inline). |
| 215 | `    restaurante_uid UUID NOT NULL,  -- Misma fila que Restaurante.restaurante_uid` | Define una columna (tipo, restricciones y/o comentario inline). |
| 216 | `    comentario TEXT NOT NULL,  -- Comentario del cliente` | Define una columna (tipo, restricciones y/o comentario inline). |
| 217 | `    fecha TIMESTAMP NOT NULL DEFAULT NOW(),  -- Fecha del comentario` | Define una columna (tipo, restricciones y/o comentario inline). |
| 218 | `    calificacion INT NOT NULL DEFAULT 0 CHECK (calificacion >= 0 AND calificacion <= 5),  -- CalificaciÃ³n del 1 al 5 (0 = sin dato)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 219 | `    FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE,` | Define llave foranea para integridad referencial. |
| 220 | `    FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 221 | `);` | Cierra la definicion del objeto SQL actual. |
| 222 | _(vacia)_ | Separador visual entre bloques SQL. |
| 223 | `CREATE INDEX idx_comentarios_restaurante_uid ON "Comentarios" (restaurante_uid);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 224 | _(vacia)_ | Separador visual entre bloques SQL. |
| 225 | `-- Tabla JWT_Tokens: Una fila por sesiÃ³n. token = access token, refresh_token = token de refresco.` | Comentario descriptivo del bloque siguiente. |
| 226 | `-- Permite renovar el access token sin cerrar sesiÃ³n buscando por refresh_token.` | Comentario descriptivo del bloque siguiente. |
| 227 | `CREATE TABLE "jwt_tokens" (` | Inicia la definicion de una nueva tabla. |
| 228 | `    id SERIAL PRIMARY KEY NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 229 | `    id_credencial INT NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 230 | `    token TEXT NOT NULL,  -- Access token (se actualiza en cada refresh)` | Define una columna (tipo, restricciones y/o comentario inline). |
| 231 | `    refresh_token TEXT NOT NULL UNIQUE,  -- Token de refresco; bÃºsqueda por este valor al renovar` | Define una columna (tipo, restricciones y/o comentario inline). |
| 232 | `    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 233 | `    expires_at TIMESTAMP NOT NULL,  -- ExpiraciÃ³n del access token` | Define una columna (tipo, restricciones y/o comentario inline). |
| 234 | `    refresh_expires_at TIMESTAMP NOT NULL,  -- ExpiraciÃ³n del refresh token` | Define una columna (tipo, restricciones y/o comentario inline). |
| 235 | `    revoked BOOLEAN NOT NULL DEFAULT FALSE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 236 | `    user_agent TEXT NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 237 | `    ip_address TEXT NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 238 | `    created_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 239 | `    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 240 | `    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE` | Define llave foranea para integridad referencial. |
| 241 | `);` | Cierra la definicion del objeto SQL actual. |
| 242 | `CREATE UNIQUE INDEX idx_jwt_tokens_refresh_token ON "jwt_tokens" (refresh_token);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 243 | _(vacia)_ | Separador visual entre bloques SQL. |
| 244 | `-- Tabla Password_Reset_Codes: CÃ³digos temporales para recuperaciÃ³n de contraseÃ±a` | Comentario descriptivo del bloque siguiente. |
| 245 | `CREATE TABLE "Password_Reset_Codes" (` | Inicia la definicion de una nueva tabla. |
| 246 | `    id SERIAL PRIMARY KEY NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 247 | `    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 248 | `    code_hash VARCHAR(255) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 249 | `    expires_at TIMESTAMP NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 250 | `    used BOOLEAN NOT NULL DEFAULT FALSE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 251 | `    created_at TIMESTAMP NOT NULL DEFAULT NOW()` | Linea SQL de soporte del bloque actual. |
| 252 | `);` | Cierra la definicion del objeto SQL actual. |
| 253 | `CREATE INDEX idx_password_reset_codes_credencial ON "Password_Reset_Codes" (id_credencial, used, expires_at);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 254 | _(vacia)_ | Separador visual entre bloques SQL. |
| 255 | `-- Tabla SMTP_config: ConfiguraciÃ³n por usuario para envÃ­o de correos (cada usuario su correo/contraseÃ±a)` | Comentario descriptivo del bloque siguiente. |
| 256 | `CREATE TABLE "SMTP_config" (` | Inicia la definicion de una nueva tabla. |
| 257 | `    id SERIAL PRIMARY KEY NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 258 | `    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 259 | `    host VARCHAR(255) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 260 | `    port INT NOT NULL CHECK (port > 0 AND port <= 65535),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 261 | `    usuario VARCHAR(255) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 262 | `    password_encrypted VARCHAR(512) NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 263 | `    from_email VARCHAR(255) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 264 | `    consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 265 | `    created_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 266 | `    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 267 | `    UNIQUE (id_credencial)` | Impone unicidad en el/los campo(s) indicados. |
| 268 | `);` | Cierra la definicion del objeto SQL actual. |
| 269 | `COMMENT ON TABLE "SMTP_config" IS 'ConfiguraciÃ³n SMTP por usuario; cada dueÃ±o/admin/empleado tiene su propio correo y contraseÃ±a';` | Documenta metadatos del esquema en PostgreSQL. |
| 270 | _(vacia)_ | Separador visual entre bloques SQL. |
| 271 | `-- Tabla IMAP_config: ConfiguraciÃ³n por usuario para lectura de correos (cada usuario su correo/contraseÃ±a)` | Comentario descriptivo del bloque siguiente. |
| 272 | `CREATE TABLE "IMAP_config" (` | Inicia la definicion de una nueva tabla. |
| 273 | `    id SERIAL PRIMARY KEY NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 274 | `    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 275 | `    host VARCHAR(255) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 276 | `    port INT NOT NULL CHECK (port > 0 AND port <= 65535),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 277 | `    usuario VARCHAR(255) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 278 | `    password_encrypted VARCHAR(512) NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 279 | `    consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 280 | `    created_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 281 | `    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 282 | `    UNIQUE (id_credencial)` | Impone unicidad en el/los campo(s) indicados. |
| 283 | `);` | Cierra la definicion del objeto SQL actual. |
| 284 | `COMMENT ON TABLE "IMAP_config" IS 'ConfiguraciÃ³n IMAP por usuario; cada dueÃ±o/admin/empleado tiene su propio correo y contraseÃ±a';` | Documenta metadatos del esquema en PostgreSQL. |
| 285 | _(vacia)_ | Separador visual entre bloques SQL. |
| 286 | `-- Tabla Mails: correos archivados desde IMAP (id_credencial = usuario al que le llega el correo)` | Comentario descriptivo del bloque siguiente. |
| 287 | `CREATE TABLE "Mails" (` | Inicia la definicion de una nueva tabla. |
| 288 | `    id SERIAL PRIMARY KEY NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 289 | `    id_credencial INT NOT NULL REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 290 | `    imap_uid INT NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 291 | `    from_email VARCHAR(512) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 292 | `    to_email VARCHAR(512) NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 293 | `    subject VARCHAR(1024) NOT NULL,` | Define una columna (tipo, restricciones y/o comentario inline). |
| 294 | `    snippet VARCHAR(1024) NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 295 | `    body_text TEXT NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 296 | `    body_html TEXT NOT NULL DEFAULT 'sin dato',` | Define una columna (tipo, restricciones y/o comentario inline). |
| 297 | `    date_received TIMESTAMP NOT NULL DEFAULT NOW(),` | Define una columna (tipo, restricciones y/o comentario inline). |
| 298 | `    created_at TIMESTAMP NOT NULL DEFAULT NOW()` | Linea SQL de soporte del bloque actual. |
| 299 | `);` | Cierra la definicion del objeto SQL actual. |
| 300 | `CREATE UNIQUE INDEX idx_mails_credencial_uid ON "Mails" (id_credencial, imap_uid);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 301 | `CREATE INDEX idx_mails_id_credencial_date ON "Mails" (id_credencial, date_received DESC);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 302 | `CREATE INDEX idx_mails_date_received ON "Mails" (date_received DESC);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 303 | `CREATE INDEX idx_mails_created_at ON "Mails" (created_at DESC);` | Crea indice para acelerar consultas y/o reforzar unicidad. |
| 304 | `COMMENT ON TABLE "Mails" IS 'Correos electrÃ³nicos archivados desde la bandeja IMAP configurada';` | Documenta metadatos del esquema en PostgreSQL. |
| 305 | _(vacia)_ | Separador visual entre bloques SQL. |
| 306 | _(vacia)_ | Separador visual entre bloques SQL. |
