CREATE OR REPLACE FUNCTION actualizar_coordenadas_restaurante(
    p_nit DECIMAL(10,0),
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION
)
RETURNS VOID AS $$
BEGIN
    UPDATE "Restaurante"
    SET lat = p_lat,
        lng = p_lng
    WHERE nit = p_nit;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe restaurante con nit=%', p_nit;
    END IF;
END;
$$ LANGUAGE plpgsql;

