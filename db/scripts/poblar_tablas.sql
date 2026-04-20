/*
 * Seed de datos para Reservify
 * Basado en la estructura definida en db/creacion_tablas.sql
 * Diseñado para ser re-ejecutable sin romper por duplicados.
 *
 * Nota: no usamos un solo BEGIN/COMMIT para todo el script. Si una sentencia falla,
 * PostgreSQL abortaría el bloque y el resto daría error 25P02. Cada INSERT va en su
 * propia transacción implícita (salvo que el cliente envíe todo en un solo bloque).
 */

-- =========================================================
-- 1) Credenciales y usuarios
-- =========================================================

INSERT INTO "Credenciales" (email, password)
VALUES
    ('dueno1@reservify.com', '$2b$12$2wQfY8m1QfM8Wut0K8bTve6SZZQf8v8m5H2l0ov3tK7f6GdLJr4Y2'),
    ('dueno2@reservify.com', '$2b$12$2wQfY8m1QfM8Wut0K8bTve6SZZQf8v8m5H2l0ov3tK7f6GdLJr4Y2'),
    ('cliente1@reservify.com', '$2b$12$2wQfY8m1QfM8Wut0K8bTve6SZZQf8v8m5H2l0ov3tK7f6GdLJr4Y2'),
    ('cliente2@reservify.com', '$2b$12$2wQfY8m1QfM8Wut0K8bTve6SZZQf8v8m5H2l0ov3tK7f6GdLJr4Y2'),
    ('empleado1@reservify.com', '$2b$12$2wQfY8m1QfM8Wut0K8bTve6SZZQf8v8m5H2l0ov3tK7f6GdLJr4Y2'),
    ('admin1@reservify.com', '$2b$12$2wQfY8m1QfM8Wut0K8bTve6SZZQf8v8m5H2l0ov3tK7f6GdLJr4Y2')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Usuario" (
    documento,
    tipo_documento,
    nombre,
    apellido,
    id_rol,
    id_credencial,
    nacionalidad,
    telefono,
    nit
)
VALUES
    (
        1000000001, 'CC', 'Laura', 'Gomez', 1,
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'dueno1@reservify.com'),
        'Colombiana', '3001112233', NULL
    ),
    (
        1000000002, 'CC', 'Camilo', 'Ruiz', 1,
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'dueno2@reservify.com'),
        'Colombiana', '3001112244', NULL
    ),
    (
        1000000003, 'CC', 'Sofia', 'Martinez', 2,
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'cliente1@reservify.com'),
        'Colombiana', '3001112255', NULL
    ),
    (
        1000000004, 'CC', 'Daniel', 'Perez', 2,
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'cliente2@reservify.com'),
        'Colombiana', '3001112266', NULL
    ),
    (
        1000000005, 'CC', 'Valeria', 'Lopez', 3,
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'empleado1@reservify.com'),
        'Colombiana', '3001112277', 90000000001
    ),
    (
        1000000006, 'CC', 'Andres', 'Castro', 4,
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'admin1@reservify.com'),
        'Colombiana', '3001112288', NULL
    )
ON CONFLICT (documento) DO NOTHING;

-- =========================================================
-- 2) Restaurantes, administradores e imagenes
-- =========================================================

INSERT INTO "Restaurante" (
    restaurante_uid,
    nit,
    direccion,
    nombre_restaurante,
    descripcion_restaurante,
    rating,
    reviews,
    availableToday,
    horario_apertura,
    horario_cierre,
    documento,
    id_categoria,
    url_image,
    min_anticipacion_horas,
    lat,
    lng
)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        90000000001,
        'Calle 100 #15-20, Bogota',
        'Sabor Andino',
        'Restaurante de cocina colombiana contemporanea',
        4.6,
        210,
        TRUE,
        '11:00',
        '22:00',
        1000000001,
        14,
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        2,
        4.6767,
        -74.0480
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        90000000002,
        'Carrera 43A #6 Sur-15, Medellin',
        'Brasa Urbana',
        'Parrilla y cocina fusion para cenas y eventos',
        4.4,
        132,
        TRUE,
        '12:00',
        '23:00',
        1000000002,
        37,
        'https://images.unsplash.com/photo-1552566626-52f8b828add9',
        1,
        6.2088,
        -75.5675
    )
ON CONFLICT (nit) DO NOTHING;

INSERT INTO "Administrador_restaurante" (id_credencial, restaurante_uid)
SELECT
    (SELECT id_credencial FROM "Usuario" WHERE documento = 1000000006),
    r.restaurante_uid
FROM "Restaurante" r
WHERE r.nit = 90000000001
ON CONFLICT (id_credencial, restaurante_uid) DO NOTHING;

INSERT INTO "Imagen_referencia_restaurante" (restaurante_uid, url_imagen, orden)
SELECT r.restaurante_uid, x.url_imagen, x.orden
FROM "Restaurante" r
JOIN (
    VALUES
        (90000000001::BIGINT, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 0),
        (90000000001::BIGINT, 'https://images.unsplash.com/photo-1559339352-11d035aa65de', 1),
        (90000000002::BIGINT, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b', 0),
        (90000000002::BIGINT, 'https://images.unsplash.com/photo-1541544181051-e46607fbc4a2', 1)
) AS x(nit, url_imagen, orden)
    ON x.nit = r.nit
ON CONFLICT (restaurante_uid, orden) DO NOTHING;

-- =========================================================
-- 3) Operacion: mesas, reservas, facturas, comentarios, calculos
-- =========================================================

INSERT INTO "Mesas" (
    estado_de_disponibilidad,
    cant_personas,
    nit,
    restaurante_uid,
    precio,
    descripcion
)
SELECT
    TRUE,
    x.cant_personas,
    r.nit,
    r.restaurante_uid,
    x.precio,
    x.descripcion
FROM "Restaurante" r
JOIN (
    VALUES
        (90000000001::BIGINT, 2, 60000.00::DECIMAL(10,2), 'Mesa junto a ventana'),
        (90000000001::BIGINT, 4, 110000.00::DECIMAL(10,2), 'Mesa familiar interior'),
        (90000000002::BIGINT, 2, 70000.00::DECIMAL(10,2), 'Mesa alta cerca de barra'),
        (90000000002::BIGINT, 6, 150000.00::DECIMAL(10,2), 'Mesa grupal principal')
) AS x(nit, cant_personas, precio, descripcion)
    ON x.nit = r.nit
WHERE NOT EXISTS (
    SELECT 1
    FROM "Mesas" m
    WHERE m.nit = r.nit
      AND m.descripcion = x.descripcion
      AND m.cant_personas = x.cant_personas
);

INSERT INTO "Encabezado_Factura" (
    nit,
    nombre_restaurante,
    direccion,
    ciudad,
    fecha,
    documento,
    forma_pago,
    precio_total
)
SELECT v.nit, v.nombre_restaurante, v.direccion, v.ciudad, v.fecha, v.documento, v.forma_pago, v.precio_total
FROM (
    VALUES
        (90000000001::BIGINT, 'Sabor Andino'::VARCHAR(255), 'Calle 100 #15-20'::VARCHAR(255), 'Bogota'::VARCHAR(255), CURRENT_DATE, 1000000003::BIGINT, 'Tarjeta'::VARCHAR(50), 120000.00::DECIMAL(10,2)),
        (90000000002::BIGINT, 'Brasa Urbana'::VARCHAR(255), 'Carrera 43A #6 Sur-15'::VARCHAR(255), 'Medellin'::VARCHAR(255), CURRENT_DATE, 1000000004::BIGINT, 'Transferencia'::VARCHAR(50), 150000.00::DECIMAL(10,2))
) AS v(nit, nombre_restaurante, direccion, ciudad, fecha, documento, forma_pago, precio_total)
WHERE NOT EXISTS (
    SELECT 1
    FROM "Encabezado_Factura" e
    WHERE e.nit = v.nit
      AND e.documento = v.documento
      AND e.fecha = v.fecha
);

INSERT INTO "Detalle_Factura" (
    descripcion,
    unidades,
    precio_unitario,
    precio_total,
    forma_pago,
    id_encab_fact
)
SELECT x.descripcion, x.unidades, x.precio_unitario, x.precio_total, x.forma_pago, ef.id_encab_fact
FROM (
    VALUES
        (90000000001::BIGINT, 1000000003::BIGINT, 'Reserva mesa para 2 personas'::VARCHAR(255), 1, 120000.00::DECIMAL(10,2), 120000.00::DECIMAL(10,2), 'Tarjeta'::VARCHAR(50)),
        (90000000002::BIGINT, 1000000004::BIGINT, 'Reserva mesa grupal para 6 personas'::VARCHAR(255), 1, 150000.00::DECIMAL(10,2), 150000.00::DECIMAL(10,2), 'Transferencia'::VARCHAR(50))
) AS x(nit, documento, descripcion, unidades, precio_unitario, precio_total, forma_pago)
JOIN LATERAL (
    SELECT id_encab_fact
    FROM "Encabezado_Factura"
    WHERE nit = x.nit AND documento = x.documento
    ORDER BY id_encab_fact DESC
    LIMIT 1
) ef ON TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM "Detalle_Factura" d
    WHERE d.id_encab_fact = ef.id_encab_fact
      AND d.descripcion = x.descripcion
);

INSERT INTO "Reserva" (
    id_mesa,
    documento,
    id_encab_fact,
    estado_reserva,
    num_comensales,
    horario,
    fecha,
    motivo_cancelacion,
    ajuste
)
SELECT
    m.id_mesa,
    x.documento,
    ef.id_encab_fact,
    x.estado_reserva,
    x.num_comensales,
    x.horario,
    x.fecha,
    x.motivo_cancelacion,
    x.ajuste
FROM (
    VALUES
        (90000000001::BIGINT, 1000000003::BIGINT, 'confirmada', 2, '19:00'::TIME, (CURRENT_DATE + INTERVAL '1 day')::DATE, 'sin dato', 'Cumpleanos - llevar vela'),
        (90000000002::BIGINT, 1000000004::BIGINT, 'pendiente', 6, '20:30'::TIME, (CURRENT_DATE + INTERVAL '2 day')::DATE, 'sin dato', 'Mesa cerca de zona ventilada')
) AS x(nit, documento, estado_reserva, num_comensales, horario, fecha, motivo_cancelacion, ajuste)
JOIN LATERAL (
    SELECT id_mesa
    FROM "Mesas"
    WHERE nit = x.nit
    ORDER BY id_mesa
    LIMIT 1
) m ON TRUE
JOIN LATERAL (
    SELECT id_encab_fact
    FROM "Encabezado_Factura"
    WHERE nit = x.nit AND documento = x.documento
    ORDER BY id_encab_fact DESC
    LIMIT 1
) ef ON TRUE
ON CONFLICT (id_mesa, fecha, horario) DO NOTHING;

INSERT INTO "Calculos_mensuales" (
    nit,
    mes,
    anio,
    total_reservas,
    revenue,
    total_clientes
)
SELECT v.nit, v.mes, v.anio, v.total_reservas, v.revenue, v.total_clientes
FROM (
    VALUES
        (90000000001::BIGINT, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT, 12, 820000.00::DECIMAL(10,2), 9),
        (90000000002::BIGINT, EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT, 8, 640000.00::DECIMAL(10,2), 6)
) AS v(nit, mes, anio, total_reservas, revenue, total_clientes)
WHERE NOT EXISTS (
    SELECT 1
    FROM "Calculos_mensuales" c
    WHERE c.nit = v.nit
      AND c.mes = v.mes
      AND c.anio = v.anio
);

INSERT INTO "Comentarios" (documento, restaurante_uid, comentario, calificacion)
SELECT
    x.documento,
    r.restaurante_uid,
    x.comentario,
    x.calificacion
FROM "Restaurante" r
JOIN (
    VALUES
        (90000000001::BIGINT, 1000000003::DECIMAL(10,0), 'Excelente servicio y buena atencion.', 5),
        (90000000002::BIGINT, 1000000004::DECIMAL(10,0), 'La comida estuvo buena, volveria.', 4)
) AS x(nit, documento, comentario, calificacion)
    ON x.nit = r.nit
WHERE NOT EXISTS (
    SELECT 1
    FROM "Comentarios" c
    WHERE c.documento = x.documento
      AND c.restaurante_uid = r.restaurante_uid
      AND c.comentario = x.comentario
);

-- =========================================================
-- 4) Seguridad y correo
-- =========================================================

INSERT INTO "jwt_tokens" (
    id_credencial,
    token,
    refresh_token,
    expires_at,
    refresh_expires_at,
    revoked,
    user_agent,
    ip_address
)
VALUES
    (
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'cliente1@reservify.com'),
        'access_token_demo_cliente1',
        'refresh_token_demo_cliente1',
        NOW() + INTERVAL '30 minutes',
        NOW() + INTERVAL '7 days',
        FALSE,
        'Seed Script Client',
        '127.0.0.1'
    ),
    (
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'dueno1@reservify.com'),
        'access_token_demo_dueno1',
        'refresh_token_demo_dueno1',
        NOW() + INTERVAL '30 minutes',
        NOW() + INTERVAL '7 days',
        FALSE,
        'Seed Script Owner',
        '127.0.0.1'
    )
ON CONFLICT (refresh_token) DO NOTHING;

INSERT INTO "Password_Reset_Codes" (id_credencial, code_hash, expires_at, used)
SELECT
    c.id_credencial,
    '$2b$12$4z4m1BfC2WmjaasrX7Y50u6X74QX8AN2tKrh6ZQ4N8WnJHjkL8s6G',
    NOW() + INTERVAL '15 minutes',
    FALSE
FROM "Credenciales" c
WHERE c.email = 'cliente2@reservify.com'
  AND NOT EXISTS (
      SELECT 1
      FROM "Password_Reset_Codes" p
      WHERE p.id_credencial = c.id_credencial
        AND p.used = FALSE
        AND p.expires_at > NOW()
  );

INSERT INTO "SMTP_config" (
    id_credencial,
    host,
    port,
    usuario,
    password_encrypted,
    from_email,
    consentimiento_archivo
)
VALUES
    (
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'dueno1@reservify.com'),
        'smtp.gmail.com',
        587,
        'dueno1@reservify.com',
        'seed_encrypted_smtp_password',
        'dueno1@reservify.com',
        TRUE
    )
ON CONFLICT (id_credencial) DO NOTHING;

INSERT INTO "IMAP_config" (
    id_credencial,
    host,
    port,
    usuario,
    password_encrypted,
    consentimiento_archivo
)
VALUES
    (
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'dueno1@reservify.com'),
        'imap.gmail.com',
        993,
        'dueno1@reservify.com',
        'seed_encrypted_imap_password',
        TRUE
    )
ON CONFLICT (id_credencial) DO NOTHING;

INSERT INTO "Mails" (
    id_credencial,
    imap_uid,
    from_email,
    to_email,
    subject,
    snippet,
    body_text,
    body_html
)
VALUES
    (
        (SELECT id_credencial FROM "Credenciales" WHERE email = 'dueno1@reservify.com'),
        1001,
        'cliente1@reservify.com',
        'dueno1@reservify.com',
        'Consulta de reserva para grupo',
        'Hola, quiero reservar para este fin de semana...',
        'Hola, quiero reservar para este fin de semana para 6 personas. Gracias.',
        '<p>Hola, quiero reservar para este fin de semana para 6 personas. Gracias.</p>'
    )
ON CONFLICT (id_credencial, imap_uid) DO NOTHING;

