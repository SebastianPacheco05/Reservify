/*
 * Funciones y triggers relacionados con el rol administrador y la tabla Usuario.
 */

-- Rol administrador por defecto (si no existe)
INSERT INTO "Roles" (nombre_rol, descripcion)
SELECT 'administrador', 'Administra un solo restaurante'
WHERE NOT EXISTS (SELECT 1 FROM "Roles" WHERE LOWER(TRIM(nombre_rol)) = 'administrador');

-- ValidaciÃ³n: un administrador siempre debe estar vinculado a un restaurante (nit NOT NULL)
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

DROP TRIGGER IF EXISTS trigger_validar_admin_restaurante ON "Usuario";
CREATE TRIGGER trigger_validar_admin_restaurante
    BEFORE INSERT OR UPDATE ON "Usuario"
    FOR EACH ROW
    EXECUTE FUNCTION validar_admin_tiene_restaurante();

