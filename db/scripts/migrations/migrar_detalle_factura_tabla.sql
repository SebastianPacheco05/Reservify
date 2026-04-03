-- Migracion: crear tabla Detalle_Factura si no existe (lineas de factura)
--
-- El dashboard y data_owner consultan "Detalle_Factura"; el esquema base solo tenia Encabezado_Factura.
--
-- Ejecucion:
--   psql "postgresql://USER:PASS@HOST:5432/db_reservify" -f db/scripts/migrations/migrar_detalle_factura_tabla.sql

CREATE TABLE IF NOT EXISTS "Detalle_Factura" (
    id_det_fact SERIAL PRIMARY KEY NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    unidades INT NOT NULL CHECK (unidades > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL,
    forma_pago VARCHAR(50) NOT NULL,
    id_encab_fact INT NOT NULL,
    CONSTRAINT detalle_factura_forma_pago_chk CHECK (
        forma_pago IN ('Efectivo', 'Tarjeta', 'Transferencia', 'Otro', 'Pendiente')
    ),
    CONSTRAINT detalle_factura_encab_fkey FOREIGN KEY (id_encab_fact)
        REFERENCES "Encabezado_Factura" (id_encab_fact) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_detalle_factura_id_encab ON "Detalle_Factura" (id_encab_fact);

COMMENT ON TABLE "Detalle_Factura" IS 'Lineas de detalle por factura (encabezado).';

-- Alinear funcion insertar_detalle_factura con columnas escalares (una fila por linea)
CREATE OR REPLACE FUNCTION insertar_detalle_factura(
    p_descripcion VARCHAR(100)[],
    p_unidades INT[],
    p_precio_unitario DECIMAL(10,2)[],
    p_precio_total DECIMAL(10,2),
    p_forma_pago VARCHAR(50),
    p_id_encab_fact INT
) RETURNS INT AS $$
DECLARE
    v_id_det_fact INT;
    i INT;
    n INT;
BEGIN
    IF p_descripcion IS NULL OR array_length(p_descripcion, 1) IS NULL THEN
        RETURN NULL;
    END IF;

    n := array_length(p_descripcion, 1);
    FOR i IN 1..n LOOP
        INSERT INTO "Detalle_Factura" (
            descripcion,
            unidades,
            precio_unitario,
            precio_total,
            forma_pago,
            id_encab_fact
        ) VALUES (
            COALESCE(p_descripcion[i], ''),
            COALESCE(p_unidades[i], 1),
            COALESCE(p_precio_unitario[i], 0),
            COALESCE(p_precio_unitario[i], 0) * COALESCE(p_unidades[i], 1),
            p_forma_pago,
            p_id_encab_fact
        ) RETURNING id_det_fact INTO v_id_det_fact;
    END LOOP;

    RETURN v_id_det_fact;
END;
$$ LANGUAGE plpgsql;
