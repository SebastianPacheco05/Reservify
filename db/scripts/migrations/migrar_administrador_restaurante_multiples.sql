-- Migración: administradores multi-restaurante con tabla puente.
-- Objetivo:
-- 1) Crear Administrador_restaurante si no existe.
-- 2) Migrar vínculos existentes desde Usuario.nit (rol administrador).
-- 3) Eliminar trigger/función antiguos que exigían nit en administrador.
-- 4) Dejar Usuario.nit en NULL para administradores.

BEGIN;

CREATE TABLE IF NOT EXISTS "Administrador_restaurante" (
    id_credencial INT NOT NULL,
    restaurante_uid UUID NOT NULL,
    PRIMARY KEY (id_credencial, restaurante_uid),
    UNIQUE (restaurante_uid),
    FOREIGN KEY (id_credencial) REFERENCES "Usuario" (id_credencial) ON DELETE CASCADE,
    FOREIGN KEY (restaurante_uid) REFERENCES "Restaurante" (restaurante_uid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_restaurante_id_credencial
    ON "Administrador_restaurante" (id_credencial);

CREATE INDEX IF NOT EXISTS idx_admin_restaurante_uid
    ON "Administrador_restaurante" (restaurante_uid);

INSERT INTO "Administrador_restaurante" (id_credencial, restaurante_uid)
SELECT u.id_credencial, r.restaurante_uid
FROM "Usuario" u
JOIN "Roles" ro ON ro.id_rol = u.id_rol
JOIN "Restaurante" r ON r.nit = u.nit
WHERE LOWER(TRIM(ro.nombre_rol)) = 'administrador'
  AND u.nit IS NOT NULL
ON CONFLICT (id_credencial, restaurante_uid) DO NOTHING;

DROP TRIGGER IF EXISTS trigger_validar_admin_restaurante ON "Usuario";
DROP FUNCTION IF EXISTS validar_admin_tiene_restaurante();

UPDATE "Usuario" u
SET nit = NULL
WHERE u.id_rol = (
    SELECT id_rol
    FROM "Roles"
    WHERE LOWER(TRIM(nombre_rol)) = 'administrador'
    LIMIT 1
);

COMMIT;
