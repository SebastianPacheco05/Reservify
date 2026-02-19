/*
 * Migración: motivo_cancelacion y ajuste en Reserva; tablas IMAP y SMTP
 *
 * NOTA: Estos cambios están integrados en scripts/tablas/creacion_tablas.sql.
 * Este archivo se mantiene para aplicar solo en bases de datos existentes
 * que ya tienen el esquema base creado (sin volver a ejecutar todo creacion_tablas).
 *
 * Uso de IMAP/SMTP: solo usuarios admin, dueño y empleado desde el dashboard.
 */

-- 1) Reserva: motivo de cancelación y ajuste (notas/observaciones)
ALTER TABLE "Reserva"
  ADD COLUMN IF NOT EXISTS motivo_cancelacion TEXT,
  ADD COLUMN IF NOT EXISTS ajuste TEXT;

COMMENT ON COLUMN "Reserva".motivo_cancelacion IS 'Motivo indicado al cancelar; se envía al cliente por correo';
COMMENT ON COLUMN "Reserva".ajuste IS 'Observaciones o ajuste solicitado por el cliente en la reserva';

-- 2) Tabla SMTP: configuración para envío de correos (dashboard admin/dueño/empleado)
CREATE TABLE IF NOT EXISTS "SMTP_config" (
    id SERIAL PRIMARY KEY NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL CHECK (port > 0 AND port <= 65535),
    usuario VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(512),
    from_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE "SMTP_config" IS 'Configuración SMTP para envío de correos; uso solo admin, dueño y empleado en dashboard';

-- 3) Tabla IMAP: configuración para lectura de correos (dashboard admin/dueño/empleado)
CREATE TABLE IF NOT EXISTS "IMAP_config" (
    id SERIAL PRIMARY KEY NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL CHECK (port > 0 AND port <= 65535),
    usuario VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(512),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE "IMAP_config" IS 'Configuración IMAP para lectura de correos; uso solo admin, dueño y empleado en dashboard';

-- Trigger para actualizar updated_at en SMTP_config
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

-- Trigger para actualizar updated_at en IMAP_config
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
