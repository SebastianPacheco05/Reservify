/*
 * Migración: ampliar direccion en Restaurante para direcciones largas (ej. Nominatim).
 * VARCHAR(50) es insuficiente; se amplía a VARCHAR(255).
 */
ALTER TABLE "Restaurante"
  ALTER COLUMN direccion TYPE VARCHAR(255);
