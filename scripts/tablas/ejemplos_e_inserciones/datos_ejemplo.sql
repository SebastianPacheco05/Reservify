    -- Script para insertar datos de ejemplo en las tablas

    -- Insertar roles
    INSERT INTO "Roles" (nombre_rol, descripcion) VALUES
    ('ADMIN', 'Administrador del sistema'),
    ('DUENO', 'Dueño de restaurante'),
    ('CLIENTE', 'Cliente del sistema'),
    ('EMPLEADO', 'Empleado de restaurante');

    -- Insertar credenciales
    INSERT INTO "Credenciales" (email, password) VALUES
    ('admin@reservify.com', 'admin123'),
    ('dueno1@reservify.com', 'dueno123'),
    ('cliente1@reservify.com', 'cliente123'),
    ('empleado1@reservify.com', 'empleado123');

    -- Insertar dueño
    INSERT INTO "Dueno" (nombre1, apellido1, id_rol, id_credencial) VALUES
    ('Juan', 'Pérez', 2, 2),
    ('Ana', 'Martínez', 2, 5);

    -- Insertar categorías
    INSERT INTO "Categorias" (nombre_categoria) VALUES
    ('Italiano'),
    ('Mexicano'),
    ('Japonés'),
    ('Colombiano'),
    ('Vegetariano'),
    ('Mariscos');

    -- Insertar restaurante
    INSERT INTO "Restaurante" (NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, id_dueno, id_categoria) VALUES
    (1234567890, 'Calle 123 #45-67', 'La Trattoria', 'Restaurante italiano tradicional', '11:00:00', '22:00:00', 1, 1),
    (9876543210, 'Carrera 10 #20-30', 'El Mariachi', 'Comida mexicana auténtica', '12:00:00', '23:00:00', 2, 2),
    (5555555555, 'Avenida 5 #10-20', 'Sushi House', 'Sushi y comida japonesa', '13:00:00', '21:00:00', 2, 3);

    -- Insertar mesas
    INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, NIT, precio) VALUES
    (true, 2, 1234567890, 50000),
    (true, 4, 1234567890, 75000),
    (true, 6, 1234567890, 100000),
    (false, 2, 9876543210, 40000),
    (true, 4, 9876543210, 60000),
    (true, 2, 5555555555, 45000);

    -- Insertar cliente
    INSERT INTO "Cliente" (id_credencial, nombre1, apellido1, tipo_documento, documento, nacionalidad, telefono, id_rol) VALUES
    (3, 'María', 'González', 'CC', 1234567890, 'Colombiana', '3001234567', 3),
    (6, 'Pedro', 'Ramírez', 'CE', 2345678901, 'Mexicano', '3012345678', 3),
    (7, 'Luisa', 'Fernández', 'TI', 3456789012, 'Colombiana', '3023456789', 3);

    -- Insertar empleado
    INSERT INTO "Empleado" (id_credencial, nombre1, apellido1, tipo_documento, documento, nacionalidad, telefono, id_rol, NIT) VALUES
    (4, 'Carlos', 'Rodríguez', 'CC', 9876543210, 'Colombiana', '3009876543', 4, 1234567890),
    (8, 'Sofía', 'López', 'CC', 8765432109, 'Colombiana', '3034567890', 4, 9876543210),
    (9, 'Miguel', 'Torres', 'CE', 7654321098, 'Japonés', '3045678901', 4, 5555555555);

    -- Insertar encabezado de factura
    INSERT INTO "Encabezado_Factura" (NIT, nombre_restaurante, direccion, ciudad, fecha, id_cliente) VALUES
    (1234567890, 'La Trattoria', 'Calle 123 #45-67', 'Bogotá', CURRENT_DATE, 1),
    (9876543210, 'El Mariachi', 'Carrera 10 #20-30', 'Medellín', CURRENT_DATE, 2),
    (5555555555, 'Sushi House', 'Avenida 5 #10-20', 'Cali', CURRENT_DATE, 3);

    -- Insertar detalle de factura
    INSERT INTO "Detalle_Factura" (descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact) VALUES
    (ARRAY['Pizza Margherita', 'Agua Mineral'], ARRAY[1, 2], ARRAY[25000, 5000], 35000, 'Tarjeta', 1),
    (ARRAY['Tacos', 'Margarita'], ARRAY[3, 2], ARRAY[12000, 8000], 52000, 'Efectivo', 2),
    (ARRAY['Sushi Roll', 'Té Verde'], ARRAY[2, 2], ARRAY[18000, 4000], 44000, 'Transferencia', 3);

    -- Insertar reserva
    INSERT INTO "Reserva" (id_mesa, id_cliente, id_encab_fact, horario, estado_reserva, fecha) VALUES
    (1, 1, 1, '15:00:00', 'confirmada', CURRENT_DATE),
    (4, 2, 2, '19:00:00', 'pendiente', CURRENT_DATE),
    (6, 3, 3, '13:30:00', 'finalizada', CURRENT_DATE);

    -- Insertar cálculos mensuales
    INSERT INTO "Calculos_mensuales" (NIT, mes, anio, total_reservas, revenue, total_clientes) VALUES
    (1234567890, 6, 2024, 25, 1200000.00, 20),
    (9876543210, 6, 2024, 18, 900000.00, 15),
    (5555555555, 6, 2024, 12, 600000.00, 10);

    -- Más ejemplos de cálculos mensuales para otros meses
    INSERT INTO "Calculos_mensuales" (NIT, mes, anio, total_reservas, revenue, total_clientes) VALUES
    (1234567890, 5, 2024, 30, 1500000.00, 25),
    (9876543210, 5, 2024, 20, 1000000.00, 18),
    (5555555555, 5, 2024, 15, 700000.00, 12); 