/*
 * Migración: ampliar direccion, nombre_restaurante y ciudad en Encabezado_Factura.
 * VARCHAR(50) / VARCHAR(20) son insuficientes para direcciones completas (ej. Nominatim)
 * y nombres largos; se amplían a VARCHAR(255).
 */
ALTER TABLE "Encabezado_Factura"
  ALTER COLUMN direccion TYPE VARCHAR(255),
  ALTER COLUMN nombre_restaurante TYPE VARCHAR(255),
  ALTER COLUMN ciudad TYPE VARCHAR(255);
