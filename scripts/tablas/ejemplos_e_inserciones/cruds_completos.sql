CREATE OR REPLACE FUNCTION insertar_calculo_mensual(
    p_nit INT,
    p_mes INT,
    p_anio INT,
    p_total_reservas INT,
    p_revenue DECIMAL,
    p_total_clientes INT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO "Calculos_mensuales" (NIT, mes, anio, total_reservas, revenue, total_clientes)
    VALUES (p_nit, p_mes, p_anio, p_total_reservas, p_revenue, p_total_clientes);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION editar_calculo_mensual(
    p_id_calculo INT,
    p_nit INT,
    p_mes INT,
    p_anio INT,
    p_total_reservas INT,
    p_revenue DECIMAL,
    p_total_clientes INT
)
RETURNS VOID AS $$
BEGIN
    UPDATE "Calculos_mensuales"
    SET NIT = p_nit,
        mes = p_mes,
        anio = p_anio,
        total_reservas = p_total_reservas,
        revenue = p_revenue,
        total_clientes = p_total_clientes
    WHERE id_calculo = p_id_calculo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_calculo_mensual(
    p_id_calculo INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM "Calculos_mensuales"
    WHERE id_calculo = p_id_calculo;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_categoria(
    p_id_categoria INT,
    p_nombre_categoria VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE "Categorias"
    SET nombre_categoria = p_nombre_categoria
    WHERE id_categoria = p_id_categoria;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la categoría con ID %', p_id_categoria;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_categoria(
    p_nombre_categoria VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO "Categorias" (nombre_categoria)
    VALUES (p_nombre_categoria);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_categoria(
    p_id_categoria INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM "Categorias"
    WHERE id_categoria = p_id_categoria;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró la categoría con ID %', p_id_categoria;
    END IF;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_clientes(
    p_id_cliente INT,
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Cliente"
    SET id_credencial = p_id_credencial,
        nombre1 = p_nombre1,
        apellido1 = p_apellido1,
        tipo_documento = p_tipo_documento,
        documento = p_documento,
        nacionalidad = p_nacionalidad,
        telefono = p_telefono,
        id_rol = p_id_rol
    WHERE id_cliente = p_id_cliente;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_clientes(
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Cliente" (id_credencial, nombre1, apellido1, tipo_documento, documento, nacionalidad, telefono, id_rol)
    VALUES (p_id_credencial, p_nombre1, p_apellido1, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol);
    -- Exepciones en la base de datos
    IF NOT p_id_credencial THEN
        RAISE EXCEPTION 'No se pudo insertar el cliente con id_credencial: %', p_id_credencial;
    END IF;
    IF NOT p_documento THEN
        RAISE EXCEPTION 'No se pudo insertar el cliente con documento: %', p_documento;
    END IF;
    IF NOT p_telefono THEN
        RAISE EXCEPTION 'No se pudo insertar el cliente con telefono: %', p_telefono;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_clientes(
    p_id_cliente INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Cliente"
    WHERE id_cliente = p_id_cliente;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_credenciales(
    p_id_credencial INT,
    p_email VARCHAR(100),
    p_password VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    UPDATE "Credenciales"
    SET email = p_email,
        password = p_password
    WHERE id_credencial = p_id_credencial;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_credenciales(
    p_email VARCHAR(100),
    p_password VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Credenciales" (email, password)
    VALUES (p_email, p_password);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_credenciales(
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Credenciales"
    WHERE id_credencial = p_id_credencial;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_detalle_factura(
    p_id_det_fact INT,
    p_descripcion VARCHAR(100),
    p_unidades INT,
    p_precio_unitario DECIMAL(10,2),
    p_precio_total DECIMAL(10,2),
    p_forma_pago VARCHAR(50),
    p_id_encab_fact INT
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE "Detalle_Factura"
    SET 
        descripcion = p_descripcion,
        unidades = p_unidades,
        precio_unitario = p_precio_unitario,
        precio_total = p_precio_total,
        forma_pago = p_forma_pago,
        id_encab_fact = p_id_encab_fact
    WHERE id_det_fact = p_id_det_fact;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_detalle_factura(
    p_descripcion VARCHAR(100)[],
    p_unidades INT[],
    p_precio_unitario DECIMAL(10,2)[],
    p_precio_total DECIMAL(10,2),
    p_forma_pago VARCHAR(50),
    p_id_encab_fact INT
) RETURNS INT AS $$
DECLARE
    v_id_det_fact INT;
BEGIN
    INSERT INTO "Detalle_Factura" (
        descripcion,
        unidades,
        precio_unitario,
        precio_total,
        forma_pago,
        id_encab_fact
    ) VALUES (
        p_descripcion,
        p_unidades,
        p_precio_unitario,
        p_precio_total,
        p_forma_pago,
        p_id_encab_fact
    ) RETURNING id_det_fact INTO v_id_det_fact;
    
    RETURN v_id_det_fact;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_detalle_factura(
    p_id_det_fact INT
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM "Detalle_Factura"
    WHERE id_det_fact = p_id_det_fact;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_dueno(
    p_id_dueno INT,
    p_nombre1 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_id_rol INT,
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Dueno"
    SET nombre1 = p_nombre1,
        apellido1 = p_apellido1,
        id_rol = p_id_rol,
        id_credencial = p_id_credencial
    WHERE id_dueno = p_id_dueno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_dueno(
    p_nombre1 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_id_rol INT,
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Dueno" ( nombre1, apellido1, id_rol, id_credencial)
    VALUES (p_nombre1, p_apellido1, p_id_rol, p_id_credencial);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_dueno(
    p_id_dueno INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Dueno"
    WHERE id_dueno = p_id_dueno;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_empleado(
    p_id_empleado INT,
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT,
    p_NIT INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Empleado"
    SET id_credencial = p_id_credencial,
        nombre1 = p_nombre1,
        apellido1 = p_apellido1,
        tipo_documento = p_tipo_documento,
        documento = p_documento,
        nacionalidad = p_nacionalidad,
        telefono = p_telefono,
        id_rol = p_id_rol,
        NIT = p_NIT
    WHERE id_empleado = p_id_empleado;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_empleado(
    p_id_credencial INT,
    p_nombre1 VARCHAR(20),
    p_apellido1 VARCHAR(20),
    p_tipo_documento VARCHAR(15),
    p_documento BIGINT,
    p_nacionalidad VARCHAR(20),
    p_telefono VARCHAR(10),
    p_id_rol INT,
    p_NIT INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Empleado" (id_credencial, nombre1, apellido1, tipo_documento, documento, nacionalidad, telefono, id_rol, NIT)
    VALUES (p_id_credencial, p_nombre1, p_apellido1, p_tipo_documento, p_documento, p_nacionalidad, p_telefono, p_id_rol, p_NIT);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_empleado(
    p_id_empleado INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Empleado"
    WHERE id_empleado = p_id_empleado;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_enc_fac(
    p_id_encab_fact INT,
    p_NIT INT,
    p_nombre_restaurante VARCHAR(20),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_id_cliente INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Encabezado_Factura"
    SET NIT = p_NIT,
        nombre_restaurante = p_nombre_restaurante,
        direccion = p_direccion,
        ciudad = p_ciudad,
        fecha = p_fecha,
        id_cliente = p_id_cliente
    WHERE id_encab_fact = p_id_encab_fact;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_enc_fac(
    p_NIT INT,
    p_nombre_restaurante VARCHAR(20),
    p_direccion VARCHAR(50),
    p_ciudad VARCHAR(20),
    p_fecha DATE,
    p_id_cliente INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Encabezado_Factura" (NIT, nombre_restaurante, direccion, ciudad, fecha, id_cliente)
    VALUES (p_NIT, p_nombre_restaurante, p_direccion, p_ciudad, p_fecha, p_id_cliente);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_enc_fac(
    p_id_encab_fact INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Encabezado_Factura"
    WHERE id_encab_fact = p_id_encab_fact;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_mesas(
    p_id_mesa INT,
    p_estado_de_disponibilidad BOOLEAN,
    p_cant_personas INT,
    p_NIT INT,
    p_Precio DECIMAL(10, 2)
) RETURNS VOID AS $$
BEGIN
    UPDATE "Mesas"
    SET estado_de_disponibilidad = p_estado_de_disponibilidad,
        cant_personas = p_cant_personas,
        NIT = p_NIT,
        Precio = p_Precio
    WHERE id_mesa = p_id_mesa;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_mesas(
    p_estado_de_disponibilidad BOOLEAN,
    p_cant_personas INT,
    p_NIT INT,
    p_Precio DECIMAL(10, 2)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, NIT, Precio)
    VALUES (p_estado_de_disponibilidad, p_cant_personas, p_NIT, p_Precio);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_mesas(
    p_id_mesa INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Mesas"
    WHERE id_mesa = p_id_mesa;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_reserva(
    p_id_reserva INT,
    p_id_mesa INT,
    p_id_cliente INT,
    p_id_encab_fact INT,
    p_horario TIME,
    p_fecha DATE, 
    p_estado_reserva VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar disponibilidad de la mesa (excluyendo la reserva actual)
    IF EXISTS (
        SELECT 1 FROM "Reserva"
        WHERE id_mesa = p_id_mesa
          AND fecha = p_fecha
          AND horario = p_horario
          AND id_reserva != p_id_reserva
          AND (
              estado_reserva = 'confirmada' OR 
              estado_reserva = 'en curso' OR 
              estado_reserva = 'finalizada'
          )
    ) THEN
        RAISE EXCEPTION 'La mesa ya está reservada para esta fecha y horario';
    END IF;

    UPDATE "Reserva"
    SET 
        id_mesa = p_id_mesa,
        id_cliente = p_id_cliente,
        id_encab_fact = p_id_encab_fact,
        horario = p_horario,
        fecha = p_fecha,
        estado_reserva = p_estado_reserva
    WHERE id_reserva = p_id_reserva;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_reserva(
    p_id_mesa INT,
    p_id_cliente INT,
    p_id_encab_fact INT,
    p_horario TIME,
    p_fecha DATE,
    p_estado_reserva VARCHAR
) RETURNS INT AS $$
DECLARE
    v_id_reserva INT;
BEGIN
    -- Verificar disponibilidad de la mesa
    IF EXISTS (
        SELECT 1 FROM "Reserva"
        WHERE id_mesa = p_id_mesa
        AND fecha = p_fecha
        AND horario = p_horario
        AND (estado_reserva = 'confirmada' OR estado_reserva = 'en curso' OR estado_reserva = 'finalizada')
    ) THEN
        RAISE EXCEPTION 'La mesa ya está reservada para esta fecha y horario';
    END IF;

    INSERT INTO "Reserva" (
        id_mesa,
        id_cliente,
        id_encab_fact,
        horario,
        fecha,
        estado_reserva
    ) VALUES (
        p_id_mesa,
        p_id_cliente,
        p_id_encab_fact,
        p_horario,
        p_fecha,
        p_estado_reserva
    ) RETURNING id_reserva INTO v_id_reserva;
    
    RETURN v_id_reserva;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_reserva(
    p_id_reserva INT
) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM "Reserva"
    WHERE id_reserva = p_id_reserva;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_restaurante(
    p_NIT INT,
    p_direccion VARCHAR(50),
    p_nombre_restaurante VARCHAR(20),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_id_dueno INT,
    p_id_categoria INT
) RETURNS VOID AS $$
BEGIN
    UPDATE "Restaurante"
    SET direccion = p_direccion,
        nombre_restaurante = p_nombre_restaurante,
        descripcion_restaurante = p_descripcion_restaurante,
        horario_apertura = p_horario_apertura,
        horario_cierre = p_horario_cierre,
        id_dueno = p_id_dueno,
        id_categoria = p_id_categoria
    WHERE NIT = p_NIT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_restaurante(
    p_NIT DECIMAL(10, 0),
    p_direccion VARCHAR(50),
    p_nombre_restaurante VARCHAR(20),
    p_descripcion_restaurante VARCHAR(100),
    p_horario_apertura TIME,
    p_horario_cierre TIME,
    p_id_dueno INT,
    p_id_categoria INT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Restaurante" (NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, id_dueno, id_categoria)
    VALUES (p_NIT, p_direccion, p_nombre_restaurante, p_descripcion_restaurante, p_horario_apertura, p_horario_cierre, p_id_dueno, p_id_categoria);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_restaurante(
    p_NIT INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Restaurante"
    WHERE NIT = p_NIT;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION editar_roles(
    p_id_rol INT,
    p_nombre_rol VARCHAR(15),
    p_descripcion VARCHAR(100)
) RETURNS VOID AS $$
BEGIN
    UPDATE "Roles"
    SET nombre_rol = p_nombre_rol,
        descripcion = p_descripcion
    WHERE id_rol = p_id_rol;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_roles(
    p_nombre_rol VARCHAR(15),
    p_descripcion VARCHAR(100)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Roles" (nombre_rol, descripcion)
    VALUES (p_nombre_rol, p_descripcion);
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION borrar_roles(
    p_id_rol INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Roles"
    WHERE id_rol = p_id_rol;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insertar_comentario(
    p_id_cliente INT,
    p_nit INT,
    p_comentario VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO "Comentarios" (id_cliente, nit, comentario)
    VALUES (p_id_cliente, p_nit, p_comentario);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION editar_comentarios(
    p_id_comentario INT,
	p_comentario varchar
) RETURNS VOID AS $$
BEGIN
    UPDATE "Comentarios"
    SET comentario = p_comentario
    WHERE id_comentario = p_id_comentario;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION borrar_comentarios(
    p_id_credencial INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Comentarios"
    WHERE id_comentario = p_id_comentario;
END;
$$ LANGUAGE plpgsql;

