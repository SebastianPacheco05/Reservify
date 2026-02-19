/*
 * Migración: columna body_html en Mails para contenido HTML del correo.
 */

ALTER TABLE "Mails"
  ADD COLUMN IF NOT EXISTS body_html TEXT;

COMMENT ON COLUMN "Mails".body_html IS 'Contenido HTML del correo para visualización completa';
