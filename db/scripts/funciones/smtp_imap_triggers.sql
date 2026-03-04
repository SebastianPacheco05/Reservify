/*
 * Triggers para mantener updated_at en SMTP_config e IMAP_config.
 */

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
    FOR EACH ROW EXECUTE PROCEDURE actualizar_updated_at_smtp();

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
    FOR EACH ROW EXECUTE PROCEDURE actualizar_updated_at_imap();

