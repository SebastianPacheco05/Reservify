/*
 * Migración: Consentimiento de archivado en SMTP/IMAP y tabla Mails
 *
 * - Añade consentimiento_archivo (BOOLEAN) a SMTP_config e IMAP_config.
 * - Crea la tabla Mails para almacenar los correos electrónicos.
 *
 * Uso: ejecutar en bases de datos que ya tengan SMTP_config e IMAP_config.
 */

-- 1) Consentimiento de archivado en SMTP_config
ALTER TABLE "SMTP_config"
  ADD COLUMN IF NOT EXISTS consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN "SMTP_config".consentimiento_archivo IS 'Usuario autoriza archivado y conservación de correos en nuestros sistemas';

-- 2) Consentimiento de archivado en IMAP_config
ALTER TABLE "IMAP_config"
  ADD COLUMN IF NOT EXISTS consentimiento_archivo BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN "IMAP_config".consentimiento_archivo IS 'Usuario autoriza archivado y conservación de correos en nuestros sistemas';

-- 3) Tabla Mails: correos archivados (provenientes de IMAP)
CREATE TABLE IF NOT EXISTS "Mails" (
    id SERIAL PRIMARY KEY NOT NULL,
    imap_uid INT NOT NULL,
    from_email VARCHAR(512) NOT NULL,
    to_email VARCHAR(512),
    subject VARCHAR(1024) NOT NULL,
    snippet VARCHAR(1024),
    body_text TEXT,
    date_received TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE "Mails" IS 'Correos electrónicos archivados desde la bandeja IMAP configurada';

-- Índice para evitar duplicados por mismo correo (imap_uid es único por buzón)
CREATE UNIQUE INDEX IF NOT EXISTS idx_mails_imap_uid ON "Mails" (imap_uid);

-- Índice para listar por fecha
CREATE INDEX IF NOT EXISTS idx_mails_date_received ON "Mails" (date_received DESC);
CREATE INDEX IF NOT EXISTS idx_mails_created_at ON "Mails" (created_at DESC);
