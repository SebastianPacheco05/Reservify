CREATE OR REPLACE FUNCTION borrar_restaurante(p_restaurante_uid UUID)
RETURNS VOID AS $$
DECLARE
  v_id_rol_cliente INT;
  v_id_rol_administrador INT;
  v_nit BIGINT;
BEGIN
  -- Obtener NIT del restaurante objetivo
  SELECT nit
  INTO v_nit
  FROM "Restaurante"
  WHERE restaurante_uid = p_restaurante_uid
  LIMIT 1;

  IF v_nit IS NULL THEN
    RAISE EXCEPTION 'Restaurante no encontrado para uid=%', p_restaurante_uid;
  END IF;

  -- Obtener id de roles
  SELECT id_rol
  INTO v_id_rol_cliente
  FROM "Roles"
  WHERE LOWER(TRIM(nombre_rol)) = 'cliente'
  LIMIT 1;

  SELECT id_rol
  INTO v_id_rol_administrador
  FROM "Roles"
  WHERE LOWER(TRIM(nombre_rol)) = 'administrador'
  LIMIT 1;

  -- Empleados vinculados por NIT: pasar a cliente y limpiar nit
  IF v_id_rol_cliente IS NOT NULL THEN
    UPDATE "Usuario"
    SET
      id_rol = v_id_rol_cliente,
      nit = NULL
    WHERE nit = v_nit;
  ELSE
    -- Si no existe rol cliente, al menos desvincular el NIT
    UPDATE "Usuario"
    SET nit = NULL
    WHERE nit = v_nit;
  END IF;

  -- Administradores del restaurante (tabla puente):
  -- si el admin solo tenía este restaurante, degradarlo a cliente y limpiar nit.
  IF v_id_rol_administrador IS NOT NULL THEN
    IF v_id_rol_cliente IS NOT NULL THEN
      UPDATE "Usuario" u
      SET id_rol = v_id_rol_cliente,
          nit = NULL
      WHERE u.id_rol = v_id_rol_administrador
        AND u.id_credencial IN (
          SELECT ar.id_credencial
          FROM "Administrador_restaurante" ar
          WHERE ar.restaurante_uid = p_restaurante_uid
        )
        AND NOT EXISTS (
          SELECT 1
          FROM "Administrador_restaurante" ar2
          WHERE ar2.id_credencial = u.id_credencial
            AND ar2.restaurante_uid <> p_restaurante_uid
        );
    END IF;
  END IF;

  -- Borrar restaurante (borra en cascada mesas, comentarios, imágenes y puente admin).
  DELETE FROM "Restaurante" WHERE restaurante_uid = p_restaurante_uid;
END;
$$ LANGUAGE plpgsql;