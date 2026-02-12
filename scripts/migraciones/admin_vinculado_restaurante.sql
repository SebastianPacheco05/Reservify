-- Migración: Asegurar que los administradores siempre estén vinculados a un restaurante
-- Un administrador (rol "administrador") DEBE tener nit (restaurante asignado) NO NULL

-- 1) Actualizar registros existentes: si hay administradores sin nit, asignarles uno o eliminarlos
-- (Por seguridad, mejor eliminarlos o asignarles un restaurante manualmente)
-- UPDATE "Usuario" u
-- SET nit = (SELECT nit FROM "Restaurante" LIMIT 1)
-- WHERE EXISTS (
--     SELECT 1 FROM "Roles" r 
--     WHERE r.id_rol = u.id_rol 
--     AND LOWER(TRIM(r.nombre_rol)) = 'administrador'
-- ) AND u.nit IS NULL;

-- 2) Agregar constraint: si el rol es administrador, nit NO puede ser NULL
-- Nota: PostgreSQL no permite CHECK constraints con subconsultas directamente,
-- así que usamos un trigger o validación a nivel de aplicación.
-- Alternativa: función de validación que se llama antes de INSERT/UPDATE

-- Función de validación para administradores
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

-- Crear trigger antes de INSERT o UPDATE en Usuario
DROP TRIGGER IF EXISTS trigger_validar_admin_restaurante ON "Usuario";
CREATE TRIGGER trigger_validar_admin_restaurante
    BEFORE INSERT OR UPDATE ON "Usuario"
    FOR EACH ROW
    EXECUTE FUNCTION validar_admin_tiene_restaurante();

COMMENT ON FUNCTION validar_admin_tiene_restaurante() IS 'Valida que los administradores siempre tengan un restaurante asignado (nit NOT NULL)';
