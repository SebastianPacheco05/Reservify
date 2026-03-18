-- FunciÃ³n y trigger: limitar a 15 imÃ¡genes de referencia por restaurante
CREATE OR REPLACE FUNCTION verificar_max_imagenes_referencia()
RETURNS TRIGGER AS $$
DECLARE
    total_imagenes INT;
BEGIN
    SELECT COUNT(*) INTO total_imagenes
    FROM "Imagen_referencia_restaurante"
    WHERE nit = NEW.nit;
    
    IF total_imagenes >= 15 THEN
        RAISE EXCEPTION 'MÃ¡ximo 15 imÃ¡genes de referencia por restaurante';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_imagenes_ref
    BEFORE INSERT ON "Imagen_referencia_restaurante"
    FOR EACH ROW
    EXECUTE FUNCTION verificar_max_imagenes_referencia();


-- FunciÃ³n y trigger: actualizar updated_at en SMTP_config
CREATE OR REPLACE FUNCTION actualizar_updated_at_smtp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_smtp_updated_at
    BEFORE UPDATE ON "SMTP_config"
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at_smtp();


-- FunciÃ³n y trigger: actualizar updated_at en IMAP_config
CREATE OR REPLACE FUNCTION actualizar_updated_at_imap()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_imap_updated_at
    BEFORE UPDATE ON "IMAP_config"
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at_imap();


-- FunciÃ³n y trigger: Validar que los administradores siempre tengan un restaurante asignado (nit NOT NULL)
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

CREATE TRIGGER trigger_validar_admin_restaurante
    BEFORE INSERT OR UPDATE ON "Usuario"
    FOR EACH ROW
    EXECUTE FUNCTION validar_admin_tiene_restaurante();

COMMENT ON FUNCTION validar_admin_tiene_restaurante() IS 'Valida que los administradores siempre tengan un restaurante asignado (nit NOT NULL)';

