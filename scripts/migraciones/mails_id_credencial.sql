/*
 * Migración: usuario que recibe el mail (id_credencial) en Mails.
 * Permite filtrar por usuario en SELECT y acelerar consultas con índice.
 */

-- 1) Columna id_credencial (nullable para poder rellenar filas existentes)
ALTER TABLE "Mails"
  ADD COLUMN IF NOT EXISTS id_credencial INT;

COMMENT ON COLUMN "Mails".id_credencial IS 'Credencial del usuario al que le llegó el correo (bandeja IMAP)';

-- 2) Rellenar filas existentes con la primera credencial
UPDATE "Mails"
SET id_credencial = (SELECT id_credencial FROM "Credenciales" ORDER BY id_credencial LIMIT 1)
WHERE id_credencial IS NULL;

-- 3) Hacer NOT NULL (falla si quedan NULL; asegurar que Credenciales tenga al menos una fila)
ALTER TABLE "Mails"
  ALTER COLUMN id_credencial SET NOT NULL;

-- 4) FK a Credenciales (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_mails_id_credencial') THEN
    ALTER TABLE "Mails"
      ADD CONSTRAINT fk_mails_id_credencial
      FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE;
  END IF;
END $$;

-- 5) Sustituir índice único por (id_credencial, imap_uid)
DROP INDEX IF EXISTS idx_mails_imap_uid;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mails_credencial_uid ON "Mails" (id_credencial, imap_uid);

-- 6) Índice para listar por usuario y fecha (SELECT rápido)
CREATE INDEX IF NOT EXISTS idx_mails_id_credencial_date ON "Mails" (id_credencial, date_received DESC);
