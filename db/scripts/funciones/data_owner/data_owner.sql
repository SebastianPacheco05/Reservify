-- Wrapper de funciones SQL de data_owner (consolidado)

-- Archivo original: db/scripts/funciones/data_owner.sql

CREATE OR REPLACE FUNCTION fn_do_obtener_contexto_gestor(p_id_credencial INT)
RETURNS TABLE (
    documento DECIMAL(10,0),
    nit DECIMAL(10,0),
    rol TEXT
)
LANGUAGE sql
STABLE
AS $$
    SELECT u.documento,
           u.nit,
           LOWER(TRIM(r.nombre_rol)) AS rol
    FROM "Usuario" u
    JOIN "Roles" r ON u.id_rol = r.id_rol
    WHERE u.id_credencial = p_id_credencial;
$$;


CREATE OR REPLACE FUNCTION fn_do_actualizar_motivo_cancelacion(
    p_id_reserva INT,
    p_motivo VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Reserva"
    SET motivo_cancelacion = p_motivo
    WHERE id_reserva = p_id_reserva;
END;
$$;


CREATE OR REPLACE FUNCTION fn_do_asignar_administrador_restaurante(
    p_nit DECIMAL(10,0),
    p_id_credencial_admin INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol_admin INT;
    v_id_rol_empleado INT;
BEGIN
    SELECT id_rol INTO v_id_rol_admin
    FROM "Roles"
    WHERE LOWER(TRIM(nombre_rol)) = 'administrador';

    SELECT id_rol INTO v_id_rol_empleado
    FROM "Roles"
    WHERE LOWER(TRIM(nombre_rol)) = 'empleado';

    IF v_id_rol_admin IS NULL OR v_id_rol_empleado IS NULL THEN
        RAISE EXCEPTION 'Roles administrador/empleado no configurados';
    END IF;

    UPDATE "Usuario"
    SET id_rol = v_id_rol_empleado,
        nit = NULL
    WHERE nit = p_nit
      AND id_rol = v_id_rol_admin
      AND id_credencial <> p_id_credencial_admin;

    UPDATE "Usuario"
    SET id_rol = v_id_rol_admin,
        nit = p_nit
    WHERE id_credencial = p_id_credencial_admin;
END;
$$;


CREATE OR REPLACE FUNCTION fn_do_cambiar_rol_a_cliente(
    p_id_credencial INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol_cliente INT;
BEGIN
    SELECT id_rol INTO v_id_rol_cliente
    FROM "Roles"
    WHERE LOWER(TRIM(nombre_rol)) = 'cliente';

    IF v_id_rol_cliente IS NULL THEN
        RAISE EXCEPTION 'Rol cliente no configurado.';
    END IF;

    UPDATE "Usuario"
    SET id_rol = v_id_rol_cliente,
        nit = NULL
    WHERE id_credencial = p_id_credencial;
END;
$$;


CREATE OR REPLACE FUNCTION fn_do_asignar_empleado_existente(
    p_id_credencial INT,
    p_nit DECIMAL(10,0)
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol_empleado INT;
BEGIN
    SELECT id_rol INTO v_id_rol_empleado
    FROM "Roles"
    WHERE LOWER(TRIM(nombre_rol)) = 'empleado';

    IF v_id_rol_empleado IS NULL THEN
        RAISE EXCEPTION 'Rol empleado no configurado.';
    END IF;

    UPDATE "Usuario"
    SET id_rol = v_id_rol_empleado,
        nit = p_nit
    WHERE id_credencial = p_id_credencial;
END;
$$;


CREATE OR REPLACE FUNCTION fn_do_email_credencial_existe(
    p_email VARCHAR
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS(
        SELECT 1
        FROM "Credenciales"
        WHERE LOWER(TRIM(email)) = LOWER(TRIM(p_email))
    );
$$;


CREATE OR REPLACE FUNCTION fn_do_crear_empleado_invitado(
    p_email VARCHAR,
    p_password_hash VARCHAR,
    p_nit DECIMAL(10,0),
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_tipo_doc VARCHAR,
    p_documento DECIMAL(10,0),
    p_nacionalidad VARCHAR,
    p_telefono VARCHAR
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol_empleado INT;
    v_id_credencial INT;
    v_documento DECIMAL(10,0);
    v_telefono VARCHAR;
    v_nacionalidad VARCHAR;
BEGIN
    SELECT id_rol INTO v_id_rol_empleado
    FROM "Roles"
    WHERE LOWER(TRIM(nombre_rol)) = 'empleado';

    IF v_id_rol_empleado IS NULL THEN
        RAISE EXCEPTION 'Rol empleado no configurado.';
    END IF;

    INSERT INTO "Credenciales" (email, password)
    VALUES (p_email, p_password_hash)
    RETURNING id_credencial INTO v_id_credencial;

    -- Para empleados invitados sin documento definido usamos id_credencial
    IF p_documento IS NULL OR p_documento <= 0 THEN
        v_documento := v_id_credencial;
    ELSE
        v_documento := p_documento;
    END IF;

    -- Normalizar nacionalidad y teléfono: si vienen vacíos o NULL, usar 'sin dato'
    IF p_telefono IS NULL OR TRIM(p_telefono) = '' THEN
        v_telefono := 'sin dato';
    ELSE
        v_telefono := p_telefono;
    END IF;

    IF p_nacionalidad IS NULL OR TRIM(p_nacionalidad) = '' THEN
        v_nacionalidad := 'sin dato';
    ELSE
        v_nacionalidad := p_nacionalidad;
    END IF;

    INSERT INTO "Usuario" (
        id_credencial, nombre, apellido, tipo_documento, documento,
        nacionalidad, telefono, id_rol, nit
    ) VALUES (
        v_id_credencial, p_nombre, p_apellido, p_tipo_doc, v_documento,
        v_nacionalidad, v_telefono, v_id_rol_empleado, p_nit
    );

    RETURN v_id_credencial;
END;
$$;

