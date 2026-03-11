CREATE OR REPLACE FUNCTION borrar_restaurante(p_nit BIGINT)
RETURNS VOID AS $$
DECLARE
  v_id_rol_cliente INT;
BEGIN
  -- Obtener id del rol cliente/usuario final
  SELECT id_rol
  INTO v_id_rol_cliente
  FROM "Roles"
  WHERE LOWER(TRIM(nombre_rol)) = 'cliente'
  LIMIT 1;

  -- Si existe rol cliente, reasignar y desvincular todos los usuarios asociados a este restaurante
  IF v_id_rol_cliente IS NOT NULL THEN
    UPDATE "Usuario"
    SET
      id_rol = v_id_rol_cliente,
      nit = NULL
    WHERE nit = p_nit;
  ELSE
    -- Si no existe el rol cliente, al menos desvincular el NIT
    UPDATE "Usuario"
    SET nit = NULL
    WHERE nit = p_nit;
  END IF;

  -- Borrar el restaurante (las FKs con ON DELETE CASCADE se eliminarán en cascada)
  DELETE FROM "Restaurante" WHERE nit = p_nit;
END;
$$ LANGUAGE plpgsql;