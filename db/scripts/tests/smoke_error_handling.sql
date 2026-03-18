-- Smoke tests (manual) para validar que las funciones NO filtran errores de PostgreSQL al cliente.
-- Esperado: ante errores, se lance ERRCODE 'P0001' con mensajes simples (sin nombres de tablas/SQL).

-- 1) Tabla/columna inexistente (simular entorno inconsistente): debería retornar "Error interno. Intenta nuevamente."
-- SELECT get_documento_by_email('correo@invalido.com');

-- 2) Datos faltantes (NOT NULL) - ejemplo genérico (ajusta a tu entorno):
-- SELECT fn_register_insertar_credenciales(NULL, 'x');

-- 3) Violación de UNIQUE (email duplicado) - ajusta email a uno ya existente:
-- SELECT fn_register_insertar_credenciales('ya@existe.com', 'x');

-- 4) Formato inválido (data_exception), ejemplo:
-- SELECT get_usuario_by_documento('no_numero');

-- Nota:
-- - Ejecuta estas consultas en tu BD de desarrollo.
-- - Verifica que el mensaje mostrado al frontend NO incluya SQL, nombres de tablas, ni stack.

