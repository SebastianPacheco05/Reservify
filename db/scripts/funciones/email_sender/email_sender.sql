-- Funciones SQL para operaciones de configuraciÃ³n SMTP/IMAP y correos (Mails)

-- Archivo original: db/scripts/funciones/email_sender.sql

CREATE OR REPLACE FUNCTION fn_es_get_smtp_config(p_id_credencial INT)
RETURNS TABLE (
    host VARCHAR,
    port INT,
    usuario VARCHAR,
    password_encrypted VARCHAR,
    from_email VARCHAR,
    consentimiento_archivo BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT host,
           port,
           usuario,
           password_encrypted,
           from_email,
           COALESCE(consentimiento_archivo, FALSE)
    FROM "SMTP_config"
    WHERE id_credencial = p_id_credencial
    LIMIT 1;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN -- undefined_table
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN -- undefined_column
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_smtp_config_existe(p_id_credencial INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM "SMTP_config"
        WHERE id_credencial = p_id_credencial
    )
    INTO v_existe;

    RETURN v_existe;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN -- undefined_table
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN -- undefined_column
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_upsert_smtp_config(
    p_id_credencial INT,
    p_host VARCHAR,
    p_port INT,
    p_usuario VARCHAR,
    p_from_email VARCHAR,
    p_password_encrypted VARCHAR,
    p_consentimiento_archivo BOOLEAN,
    p_actualizar_consentimiento BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id INT;
BEGIN
    SELECT id INTO v_id
    FROM "SMTP_config"
    WHERE id_credencial = p_id_credencial
    LIMIT 1;

    IF v_id IS NULL THEN
        INSERT INTO "SMTP_config" (
            id_credencial,
            host,
            port,
            usuario,
            password_encrypted,
            from_email,
            consentimiento_archivo
        ) VALUES (
            p_id_credencial,
            p_host,
            p_port,
            p_usuario,
            COALESCE(p_password_encrypted, ''),
            p_from_email,
            COALESCE(p_consentimiento_archivo, FALSE)
        );
    ELSE
        UPDATE "SMTP_config"
        SET host = p_host,
            port = p_port,
            usuario = p_usuario,
            from_email = p_from_email,
            updated_at = NOW(),
            password_encrypted = COALESCE(p_password_encrypted, password_encrypted),
            consentimiento_archivo = CASE
                WHEN p_actualizar_consentimiento THEN COALESCE(p_consentimiento_archivo, consentimiento_archivo)
                ELSE consentimiento_archivo
            END
        WHERE id = v_id;
    END IF;
EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Faltan datos obligatorios.';
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN unique_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Ya existe un registro con esos datos.';
    WHEN check_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_get_imap_config(p_id_credencial INT)
RETURNS TABLE (
    host VARCHAR,
    port INT,
    usuario VARCHAR,
    password_encrypted VARCHAR,
    consentimiento_archivo BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT host,
           port,
           usuario,
           password_encrypted,
           COALESCE(consentimiento_archivo, FALSE)
    FROM "IMAP_config"
    WHERE id_credencial = p_id_credencial
    LIMIT 1;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_imap_config_existe(p_id_credencial INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM "IMAP_config"
        WHERE id_credencial = p_id_credencial
    )
    INTO v_existe;

    RETURN v_existe;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_upsert_imap_config(
    p_id_credencial INT,
    p_host VARCHAR,
    p_port INT,
    p_usuario VARCHAR,
    p_password_encrypted VARCHAR,
    p_consentimiento_archivo BOOLEAN,
    p_actualizar_consentimiento BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id INT;
BEGIN
    SELECT id INTO v_id
    FROM "IMAP_config"
    WHERE id_credencial = p_id_credencial
    LIMIT 1;

    IF v_id IS NULL THEN
        INSERT INTO "IMAP_config" (
            id_credencial,
            host,
            port,
            usuario,
            password_encrypted,
            consentimiento_archivo
        ) VALUES (
            p_id_credencial,
            p_host,
            p_port,
            p_usuario,
            COALESCE(p_password_encrypted, ''),
            COALESCE(p_consentimiento_archivo, FALSE)
        );
    ELSE
        UPDATE "IMAP_config"
        SET host = p_host,
            port = p_port,
            usuario = p_usuario,
            updated_at = NOW(),
            password_encrypted = COALESCE(p_password_encrypted, password_encrypted),
            consentimiento_archivo = CASE
                WHEN p_actualizar_consentimiento THEN COALESCE(p_consentimiento_archivo, consentimiento_archivo)
                ELSE consentimiento_archivo
            END
        WHERE id = v_id;
    END IF;
EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Faltan datos obligatorios.';
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN unique_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Ya existe un registro con esos datos.';
    WHEN check_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_upsert_mail(
    p_id_credencial INT,
    p_imap_uid INT,
    p_from_email VARCHAR,
    p_to_email VARCHAR,
    p_subject VARCHAR,
    p_snippet VARCHAR,
    p_body_text TEXT,
    p_body_html TEXT,
    p_date_received TIMESTAMP
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "Mails" (
        id_credencial,
        imap_uid,
        from_email,
        to_email,
        subject,
        snippet,
        body_text,
        body_html,
        date_received
    ) VALUES (
        p_id_credencial,
        p_imap_uid,
        p_from_email,
        p_to_email,
        p_subject,
        p_snippet,
        p_body_text,
        p_body_html,
        p_date_received
    )
    ON CONFLICT (id_credencial, imap_uid) DO UPDATE
    SET subject = EXCLUDED.subject,
        snippet = EXCLUDED.snippet,
        body_text = COALESCE(EXCLUDED.body_text, "Mails".body_text),
        body_html = COALESCE(EXCLUDED.body_html, "Mails".body_html),
        date_received = EXCLUDED.date_received;
EXCEPTION
    WHEN not_null_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Faltan datos obligatorios.';
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN unique_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Ya existe un registro con esos datos.';
    WHEN check_violation THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Datos inválidos. Verifica e intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_get_mails_by_credencial(
    p_id_credencial INT,
    p_limit INT
)
RETURNS TABLE (
    imap_uid INT,
    from_email VARCHAR,
    subject VARCHAR,
    date_received TIMESTAMP,
    snippet VARCHAR
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT imap_uid,
           from_email,
           subject,
           date_received,
           snippet
    FROM "Mails"
    WHERE id_credencial = p_id_credencial
    ORDER BY date_received DESC NULLS LAST, created_at DESC NULLS LAST
    LIMIT p_limit;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;


CREATE OR REPLACE FUNCTION fn_es_get_mail_by_uid(
    p_imap_uid INT,
    p_id_credencial INT
)
RETURNS TABLE (
    imap_uid INT,
    from_email VARCHAR,
    to_email VARCHAR,
    subject VARCHAR,
    snippet VARCHAR,
    body_text TEXT,
    body_html TEXT,
    date_received TIMESTAMP,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT imap_uid,
           from_email,
           to_email,
           subject,
           snippet,
           body_text,
           body_html,
           date_received,
           created_at
    FROM "Mails"
    WHERE imap_uid = p_imap_uid
      AND id_credencial = p_id_credencial
    LIMIT 1;
EXCEPTION
    WHEN SQLSTATE '42P01' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN SQLSTATE '42703' THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
    WHEN data_exception THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Formato de datos inválido.';
    WHEN OTHERS THEN
        RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Error interno. Intenta nuevamente.';
END;
$$;

