CREATE OR REPLACE FUNCTION borrar_calculo_mensual(
    p_id_calculo INT
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM "Calculos_mensuales"
    WHERE id_calculo = p_id_calculo;
END;
$$ LANGUAGE plpgsql;
