CREATE OR REPLACE FUNCTION get_dashboard_route(p_id_credencial INT)
RETURNS TEXT AS $$
DECLARE
    v_id_rol INT;
    v_nombre_rol VARCHAR(50);
    v_ruta TEXT;
BEGIN
    -- Buscar rol según credencial (puede estar en Dueno, Cliente o Empleado)
    SELECT r.id_rol, r.nombre_rol
    INTO v_id_rol, v_nombre_rol
    FROM "Roles" r
    JOIN "Dueno" d ON d.id_rol = r.id_rol AND d.id_credencial = p_id_credencial
    UNION
    SELECT r.id_rol, r.nombre_rol
    FROM "Roles" r
    JOIN "Cliente" c ON c.id_rol = r.id_rol AND c.id_credencial = p_id_credencial
    UNION
    SELECT r.id_rol, r.nombre_rol
    FROM "Roles" r
    JOIN "Empleado" e ON e.id_rol = r.id_rol AND e.id_credencial = p_id_credencial
    LIMIT 1;

    -- Asignar ruta en base al rol
    IF v_nombre_rol = 'Dueno' THEN
        v_ruta := '/DuenoDashboard';
    ELSE
        v_ruta := '/'; -- fallback
    END IF;

    RETURN v_ruta;
END;
$$ LANGUAGE plpgsql;
