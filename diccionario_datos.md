# Diccionario de Datos - Reservify

## Tabla: Credenciales

| Campo         | Tipo de Dato     | Restricciones                                      | Descripción                        |
|---------------|------------------|----------------------------------------------------|------------------------------------|
| id_credencial | SERIAL           | PRIMARY KEY, NOT NULL                              | Identificador único autoincremental|
| email         | VARCHAR(100)     | NOT NULL, UNIQUE, CHECK formato email              | Correo electrónico del usuario     |
| password      | VARCHAR(255)     | NOT NULL                                           | Contraseña encriptada              |

---

## Tabla: Roles

| Campo         | Tipo de Dato     | Restricciones                | Descripción                        |
|---------------|------------------|------------------------------|------------------------------------|
| id_rol        | SERIAL           | PRIMARY KEY, NOT NULL, UNIQUE| Identificador único autoincremental|
| nombre_rol    | VARCHAR(15)      | NOT NULL                     | Nombre del rol                     |
| descripcion   | VARCHAR(100)     | NOT NULL                     | Descripción del rol                |

---

## Tabla: Dueno

| Campo         | Tipo de Dato     | Restricciones                                    | Descripción                        |
|---------------|------------------|--------------------------------------------------|------------------------------------|
| documento     | DECIMAL(10,0)    | PRIMARY KEY, NOT NULL                            | Documento de identidad único       |
| tipo_documento| VARCHAR(15)      | NOT NULL, CHECK (CC, CE, TI, Pasaporte)          | Tipo de documento                  |
| nombre        | VARCHAR(50)      | NOT NULL                                         | Primer nombre                      |
| apellido      | VARCHAR(50)      | NOT NULL                                         | Primer apellido                    |
| id_rol        | INT              | NOT NULL, FK Roles(id_rol)                       | Referencia al rol                  |
| id_credencial | INT              | NOT NULL, UNIQUE, FK Credenciales(id_credencial) | Referencia a credenciales únicas   |

---

## Tabla: Categorias

| Campo           | Tipo de Dato     | Restricciones         | Descripción                        |
|-----------------|------------------|-----------------------|------------------------------------|
| id_categoria    | SERIAL           | PRIMARY KEY, NOT NULL | Identificador único autoincremental|
| nombre_categoria| VARCHAR          | NOT NULL              | Nombre de la categoría             |

---

## Tabla: Restaurante

| Campo                | Tipo de Dato     | Restricciones                                    | Descripción                        |
|----------------------|------------------|--------------------------------------------------|------------------------------------|
| NIT                  | DECIMAL(10,0)    | PRIMARY KEY, NOT NULL                            | NIT como identificador único       |
| direccion            | VARCHAR(50)      | NOT NULL                                         | Dirección del restaurante          |
| nombre_restaurante   | VARCHAR(50)      | NOT NULL                                         | Nombre del restaurante             |
| descripcion_restaurante| VARCHAR(100)   | NOT NULL                                         | Descripción del restaurante        |
| horario_apertura     | TIME             | NOT NULL                                         | Hora de apertura                   |
| horario_cierre       | TIME             | NOT NULL                                         | Hora de cierre                     |
| documento            | INT              | NOT NULL, FK Dueno(documento)                    | Referencia al dueño                |
| id_categoria         | INT              | NOT NULL, FK Categorias(id_categoria)            | Referencia a la categoría          |

---

## Tabla: Mesas

| Campo                | Tipo de Dato     | Restricciones                                    | Descripción                        |
|----------------------|------------------|--------------------------------------------------|------------------------------------|
| id_mesa              | SERIAL           | PRIMARY KEY, NOT NULL                            | Identificador único autoincremental|
| estado_de_disponibilidad | BOOLEAN      | NOT NULL                                         | Estado de disponibilidad           |
| cant_personas        | INT              | CHECK (>0)                                       | Capacidad de personas              |
| NIT                  | DECIMAL(10,0)    | NOT NULL, FK Restaurante(NIT)                    | Referencia al restaurante          |
| precio               | DECIMAL(10,2)    | NOT NULL, CHECK (>=0)                            | Precio de la mesa                  |

---

## Tabla: Cliente

| Campo         | Tipo de Dato     | Restricciones                                    | Descripción                        |
|---------------|------------------|--------------------------------------------------|------------------------------------|
| id_credencial | INT              | NOT NULL, UNIQUE, FK Credenciales(id_credencial) | Referencia a credenciales únicas   |
| nombre        | VARCHAR(50)      | NOT NULL                                         | Primer nombre                      |
| apellido      | VARCHAR(50)      | NOT NULL                                         | Primer apellido                    |
| tipo_documento| VARCHAR(15)      | NOT NULL, CHECK (CC, CE, TI, Pasaporte)          | Tipo de documento                  |
| documento     | DECIMAL(10,0)    | PRIMARY KEY, NOT NULL, CHECK (>0)                | Número de documento único          |
| nacionalidad  | VARCHAR(20)      | NOT NULL                                         | Nacionalidad                       |
| telefono      | VARCHAR(10)      | NOT NULL, CHECK (10 dígitos)                     | Teléfono                           |
| id_rol        | INT              | NOT NULL, FK Roles(id_rol)                       | Referencia al rol                  |

---

## Tabla: Empleado

| Campo         | Tipo de Dato     | Restricciones                                    | Descripción                        |
|---------------|------------------|--------------------------------------------------|------------------------------------|
| id_credencial | INT              | NOT NULL, UNIQUE, FK Credenciales(id_credencial) | Referencia a credenciales únicas   |
| nombre        | VARCHAR(50)      | NOT NULL                                         | Primer nombre                      |
| apellido      | VARCHAR(50)      | NOT NULL                                         | Primer apellido                    |
| tipo_documento| VARCHAR(15)      | NOT NULL, CHECK (CC, CE, TI, Pasaporte)          | Tipo de documento                  |
| documento     | DECIMAL(10,0)    | PRIMARY KEY, NOT NULL, CHECK (>0)                | Número de documento único          |
| nacionalidad  | VARCHAR(20)      | NOT NULL                                         | Nacionalidad                       |
| telefono      | VARCHAR(10)      | NOT NULL, CHECK (10 dígitos)                     | Teléfono                           |
| id_rol        | INT              | NOT NULL, FK Roles(id_rol)                       | Referencia al rol                  |
| NIT           | INT              | NOT NULL, FK Restaurante(NIT)                    | Referencia al restaurante          |

---

## Tabla: Encabezado_Factura

| Campo             | Tipo de Dato     | Restricciones                                    | Descripción                        |
|-------------------|------------------|--------------------------------------------------|------------------------------------|
| id_encab_fact     | SERIAL           | PRIMARY KEY, NOT NULL                            | Identificador único autoincremental|
| NIT               | INT              | NOT NULL, FK Restaurante(NIT)                    | Referencia al restaurante          |
| nombre_restaurante| VARCHAR(50)      | NOT NULL                                         | Nombre del restaurante             |
| direccion         | VARCHAR(50)      | NOT NULL                                         | Dirección del restaurante          |
| ciudad            | VARCHAR(20)      | NOT NULL                                         | Ciudad                             |
| fecha             | DATE             | NOT NULL, CHECK (=CURRENT_DATE)                  | Fecha de la factura                |
| documento         | INT              | NOT NULL, FK Cliente(documento)                  | Referencia al cliente              |

---

## Tabla: Detalle_Factura

| Campo             | Tipo de Dato         | Restricciones                                    | Descripción                        |
|-------------------|----------------------|--------------------------------------------------|------------------------------------|
| id_det_fact       | SERIAL               | PRIMARY KEY, NOT NULL                            | Identificador único autoincremental|
| descripcion       | VARCHAR(100)[]       | NOT NULL                                         | Array de descripciones             |
| unidades          | INT[]                | NOT NULL                                         | Array de unidades                  |
| precio_unitario   | DECIMAL(10,2)[]      | NOT NULL                                         | Array de precios unitarios         |
| precio_total      | DECIMAL(10,2)        | NOT NULL                                         | Precio total                       |
| forma_pago        | VARCHAR(50)          | NOT NULL, CHECK (Efectivo, Tarjeta, etc.)        | Forma de pago                      |
| id_encab_fact     | INT                  | NOT NULL, FK Encabezado_Factura(id_encab_fact)   | Referencia al encabezado de factura|

---

## Tabla: Reserva

| Campo             | Tipo de Dato     | Restricciones                                    | Descripción                        |
|-------------------|------------------|--------------------------------------------------|------------------------------------|
| id_reserva        | SERIAL           | PRIMARY KEY, NOT NULL                            | Identificador único autoincremental|
| id_mesa           | INT              | NOT NULL, FK Mesas(id_mesa)                      | Referencia a la mesa               |
| documento         | INT              | NOT NULL, FK Cliente(documento)                  | Referencia al cliente              |
| id_encab_fact     | INT              | NOT NULL, FK Encabezado_Factura(id_encab_fact)   | Referencia a la factura            |
| estado_reserva    | VARCHAR          | NOT NULL, DEFAULT 'no presentada', CHECK (...)   | Estado de la reserva               |
| num_comensales    | INT              | NOT NULL, DEFAULT 1                              | Número de personas                 |
| horario           | TIME             | NOT NULL                                         | Horario de la reserva              |
| fecha             | DATE             | NOT NULL, CHECK (>=CURRENT_DATE)                 | Fecha de la reserva                |

---

## Tabla: Calculos_mensuales

| Campo             | Tipo de Dato     | Restricciones                                    | Descripción                        |
|-------------------|------------------|--------------------------------------------------|------------------------------------|
| id_calculo        | SERIAL           | PRIMARY KEY, NOT NULL                            | Identificador único autoincremental|
| NIT               | INT              | NOT NULL, FK Restaurante(NIT)                    | Referencia al restaurante          |
| mes               | INT              | NOT NULL, CHECK (1-12)                           | Mes del cálculo                    |
| anio              | INT              | NOT NULL, CHECK (>0)                             | Año del cálculo                    |
| total_reservas    | INT              | NOT NULL, DEFAULT 0                              | Total de reservas del mes          |
| revenue           | DECIMAL(10,2)    | NOT NULL, DEFAULT 0.00                           | Total facturado del mes            |
| total_clientes    | INT              | NOT NULL, DEFAULT 0                              | Total de clientes del mes          |

---

## Tabla: Comentarios

| Campo         | Tipo de Dato     | Restricciones                                    | Descripción                        |
|---------------|------------------|--------------------------------------------------|------------------------------------|
| id_comentario | SERIAL           | PRIMARY KEY, NOT NULL                            | Identificador único autoincremental|
| documento     | INT              | NOT NULL, FK Cliente(documento)                  | Referencia al cliente              |
| nit           | INT              | NOT NULL, FK Restaurante(NIT)                    | Referencia al restaurante          |
| comentario    | TEXT             | NOT NULL                                         | Comentario del cliente             |
| fecha         | TIMESTAMP        | NOT NULL, DEFAULT NOW()                          | Fecha del comentario               |
| calificacion  | INT              | CHECK (1-5)                                      | Calificación del 1 al 5            |

---

## Tabla: jwt_tokens

| Campo         | Tipo de Dato     | Restricciones                                    | Descripción                        |
|---------------|------------------|--------------------------------------------------|------------------------------------|
| id            | SERIAL           | PRIMARY KEY, NOT NULL                            | Identificador único del token      |
| id_credencial | INT              | NOT NULL, FK Credenciales(id_credencial)         | Referencia a la credencial         |
| token         | TEXT             | NOT NULL                                         | Token JWT                          |
| issued_at     | TIMESTAMP        | NOT NULL, DEFAULT NOW()                          | Fecha de emisión                   |
| expires_at    | TIMESTAMP        | NOT NULL                                         | Fecha de expiración                |
| revoked       | BOOLEAN          | NOT NULL, DEFAULT FALSE                          | Si el token fue revocado           |
| user_agent    | TEXT             | Opcional                                         | Información del navegador/dispositivo|
| ip_address    | TEXT             | Opcional                                         | Dirección IP del usuario           |
| created_at    | TIMESTAMP        | DEFAULT NOW()                                    | Registro de creación               |
| updated_at    | TIMESTAMP        | DEFAULT NOW()                                    | Última modificación                |

--- 