-- FunciÃ³n y trigger: limitar a 15 imÃ¡genes de referencia por restaurante
CREATE OR REPLACE FUNCTION verificar_max_imagenes_referencia()
RETURNS TRIGGER AS $$
DECLARE
    total_imagenes INT;
BEGIN
    SELECT COUNT(*) INTO total_imagenes
    FROM "Imagen_referencia_restaurante"
    WHERE restaurante_uid = NEW.restaurante_uid;
    
    IF total_imagenes >= 15 THEN
        RAISE EXCEPTION 'MÃ¡ximo 15 imÃ¡genes de referencia por restaurante';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_max_imagenes_ref ON "Imagen_referencia_restaurante";
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

DROP TRIGGER IF EXISTS trigger_smtp_updated_at ON "SMTP_config";
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

DROP TRIGGER IF EXISTS trigger_imap_updated_at ON "IMAP_config";
CREATE TRIGGER trigger_imap_updated_at
    BEFORE UPDATE ON "IMAP_config"
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at_imap();


-- La validación de administrador dejó de depender de Usuario.nit.
-- Ahora el vínculo se gestiona por la tabla puente "Administrador_restaurante".
DROP TRIGGER IF EXISTS trigger_validar_admin_restaurante ON "Usuario";
DROP FUNCTION IF EXISTS validar_admin_tiene_restaurante();

