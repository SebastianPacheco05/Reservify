-- Script de prueba para verificar la funcionalidad de seguridad en reservas
-- Este script debe ejecutarse después de aplicar la función get_documento_by_email

-- 1. Verificar que la función get_documento_by_email existe y funciona
SELECT 'Probando función get_documento_by_email...' as test_step;

-- Ejemplo de uso (reemplaza con un email real de tu base de datos)
-- SELECT get_documento_by_email('cliente@ejemplo.com') as documento_cliente;

-- 2. Verificar que las funciones de reserva están actualizadas
SELECT 'Verificando funciones de reserva...' as test_step;

-- Verificar parámetros de insertar_reserva
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'insertar_reserva' 
AND n.nspname = 'public';

-- Verificar parámetros de editar_reserva
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'editar_reserva' 
AND n.nspname = 'public';

-- 3. Verificar estructura de la tabla Reserva
SELECT 'Verificando estructura de tabla Reserva...' as test_step;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Reserva'
ORDER BY ordinal_position;

-- 4. Verificar que el campo documento existe en la tabla Reserva
SELECT 'Verificando campo documento en tabla Reserva...' as test_step;

SELECT EXISTS(
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'Reserva' 
    AND column_name = 'documento'
) as documento_field_exists;
