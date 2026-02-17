-- Migración: SMTP_config e IMAP_config por usuario (id_credencial)
-- Cada usuario (dueño, administrador, empleado) tiene su propia configuración de correo y contraseña.
-- Fecha: 2025

-- 1) SMTP_config: añadir id_credencial
ALTER TABLE "SMTP_config"
    ADD COLUMN IF NOT EXISTS id_credencial INT REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE;

-- Asignar la primera credencial existente a filas que ya existan (para no perder datos)
UPDATE "SMTP_config"
SET id_credencial = (SELECT id_credencial FROM "Credenciales" ORDER BY id_credencial LIMIT 1)
WHERE id_credencial IS NULL AND EXISTS (SELECT 1 FROM "Credenciales" LIMIT 1);

-- Si quedan filas sin id_credencial (no hay Credenciales), eliminarlas para poder poner NOT NULL
DELETE FROM "SMTP_config" WHERE id_credencial IS NULL;

ALTER TABLE "SMTP_config"
    ALTER COLUMN id_credencial SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_smtp_config_id_credencial ON "SMTP_config" (id_credencial);

COMMENT ON COLUMN "SMTP_config".id_credencial IS 'Usuario dueño de esta configuración SMTP (cada usuario su correo/contraseña)';

-- 2) IMAP_config: añadir id_credencial
ALTER TABLE "IMAP_config"
    ADD COLUMN IF NOT EXISTS id_credencial INT REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE;

UPDATE "IMAP_config"
SET id_credencial = (SELECT id_credencial FROM "Credenciales" ORDER BY id_credencial LIMIT 1)
WHERE id_credencial IS NULL AND EXISTS (SELECT 1 FROM "Credenciales" LIMIT 1);

DELETE FROM "IMAP_config" WHERE id_credencial IS NULL;

ALTER TABLE "IMAP_config"
    ALTER COLUMN id_credencial SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_imap_config_id_credencial ON "IMAP_config" (id_credencial);

COMMENT ON COLUMN "IMAP_config".id_credencial IS 'Usuario dueño de esta configuración IMAP (cada usuario su correo/contraseña)';
