CREATE OR REPLACE FUNCTION borrar_clientes(
    p_id_cliente INT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM "Cliente"
    WHERE id_cliente = p_id_cliente;
END;
$$ LANGUAGE plpgsql;
