-- Migración: Actualizar restricción CHECK del email para solo permitir caracteres ASCII
-- Restricción que solo permite caracteres ASCII estándar (sin Unicode como ñ, acentos, etc.)

-- Eliminar la restricción CHECK antigua
ALTER TABLE "Credenciales" DROP CONSTRAINT IF EXISTS "Credenciales_email_check";

-- Agregar nueva restricción CHECK que solo permite caracteres ASCII
-- La expresión permite:
-- - Parte local (antes del @): letras A-Z, a-z, números 0-9, y caracteres especiales: . _ % + -
-- - Dominio: letras A-Z, a-z, números 0-9, puntos y guiones
-- - TLD: al menos 2 letras A-Z o a-z
ALTER TABLE "Credenciales" 
ADD CONSTRAINT "Credenciales_email_check" 
CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND 
    length(email) <= 100
);
