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
('Juan', 'Pérez', 2, 2);

-- Insertar categorías
INSERT INTO "Categorias" (nombre_categoria) VALUES
('Italiano'),
('Mexicano'),
('Japonés'),
('Colombiano');

-- Insertar restaurante
INSERT INTO "Restaurante" (NIT, direccion, nombre_restaurante, descripcion_restaurante, horario_apertura, horario_cierre, id_dueno, id_categoria) VALUES
(1234567890, 'Calle 123 #45-67', 'La Trattoria', 'Restaurante italiano tradicional', '11:00:00', '22:00:00', 1, 1);

-- Insertar mesas
INSERT INTO "Mesas" (estado_de_disponibilidad, cant_personas, NIT, precio) VALUES
(true, 2, 1234567890, 50000),
(true, 4, 1234567890, 75000),
(true, 6, 1234567890, 100000);

-- Insertar cliente
INSERT INTO "Cliente" (id_credencial, nombre1, apellido1, tipo_documento, documento, nacionalidad, telefono, id_rol) VALUES
(3, 'María', 'González', 'CC', 1234567890, 'Colombiana', '3001234567', 3);

-- Insertar empleado
INSERT INTO "Empleado" (id_credencial, nombre1, apellido1, tipo_documento, documento, nacionalidad, telefono, id_rol, NIT) VALUES
(4, 'Carlos', 'Rodríguez', 'CC', 9876543210, 'Colombiana', '3009876543', 4, 1234567890);

-- Insertar encabezado de factura
INSERT INTO "Encabezado_Factura" (NIT, nombre_restaurante, direccion, ciudad, fecha, id_cliente) VALUES
(1234567890, 'La Trattoria', 'Calle 123 #45-67', 'Bogotá', CURRENT_DATE, 1);

-- Insertar detalle de factura
INSERT INTO "Detalle_Factura" (descripcion, unidades, precio_unitario, precio_total, forma_pago, id_encab_fact) VALUES
(ARRAY['Pizza Margherita', 'Agua Mineral'], ARRAY[1, 2], ARRAY[25000, 5000], 35000, 'Tarjeta', 1);

-- Insertar reserva
INSERT INTO "Reserva" (id_mesa, id_cliente, id_encab_fact, horario, estado_reserva, fecha) VALUES
(1, 1, 1, '19:00:00', 'confirmada', CURRENT_DATE); 