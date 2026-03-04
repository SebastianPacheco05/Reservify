    /*
    * Migración: Eliminar tablas Dueno y Empleado, renombrar Cliente -> Usuario
    * Unifica todos los usuarios en la tabla Usuario; el rol define el tipo.
    * Dueño: vinculado a restaurantes por Restaurante.documento = Usuario.documento
    * Empleado: vinculado por Usuario.nit al restaurante donde trabaja
    *
    * Ejecutar en PostgreSQL sobre una base con el esquema anterior (Cliente, Dueno, Empleado).
    */

    -- 1) Crear tabla Usuario (sin FK de nit aún por dependencia circular)
    CREATE TABLE IF NOT EXISTS "Usuario" (
        documento DECIMAL(10, 0) PRIMARY KEY NOT NULL CHECK (documento > 0),
        tipo_documento VARCHAR(15) NOT NULL CHECK (tipo_documento IN ('CC', 'CE', 'TI', 'Pasaporte')),
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        id_rol INT NOT NULL,
        id_credencial INT NOT NULL UNIQUE,
        nacionalidad VARCHAR(20),
        telefono VARCHAR(10) CHECK (telefono IS NULL OR telefono ~ '^[0-9]{10}$'),
        nit DECIMAL(10, 0) NULL,
        FOREIGN KEY (id_rol) REFERENCES "Roles" (id_rol) ON DELETE CASCADE,
        FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
    );

    -- 2) Migrar datos: Cliente -> Usuario (nit NULL)
    INSERT INTO "Usuario" (documento, tipo_documento, nombre, apellido, id_rol, id_credencial, nacionalidad, telefono, nit)
    SELECT documento, tipo_documento, nombre, apellido, id_rol, id_credencial, nacionalidad, telefono, NULL
    FROM "Cliente"
    ON CONFLICT (documento) DO NOTHING;

    -- 3) Migrar datos: Dueno -> Usuario (nacionalidad y telefono NULL, nit NULL)
    INSERT INTO "Usuario" (documento, tipo_documento, nombre, apellido, id_rol, id_credencial, nacionalidad, telefono, nit)
    SELECT documento, tipo_documento, nombre, apellido, id_rol, id_credencial, NULL, NULL, NULL
    FROM "Dueno"
    ON CONFLICT (documento) DO NOTHING;

    -- 4) Migrar datos: Empleado -> Usuario (con nit)
    INSERT INTO "Usuario" (documento, tipo_documento, nombre, apellido, id_rol, id_credencial, nacionalidad, telefono, nit)
    SELECT documento, tipo_documento, nombre, apellido, id_rol, id_credencial, nacionalidad, telefono, nit
    FROM "Empleado"
    ON CONFLICT (documento) DO NOTHING;

    -- 5) Actualizar FKs que apuntan a Cliente: ahora deben apuntar a Usuario
    -- (Elimina la FK por nombre dinámico por si PostgreSQL generó otro nombre)
    DO $$
    DECLARE
        c RECORD;
    BEGIN
        FOR c IN (SELECT tc.constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
                    AND LOWER(tc.table_name) = 'encabezado_factura' AND kcu.column_name = 'documento')
        LOOP EXECUTE format('ALTER TABLE "Encabezado_Factura" DROP CONSTRAINT IF EXISTS %I', c.constraint_name); END LOOP;
    END $$;
    ALTER TABLE "Encabezado_Factura"
        ADD CONSTRAINT "Encabezado_Factura_documento_fkey"
        FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE;

    DO $$
    DECLARE c RECORD;
    BEGIN
        FOR c IN (SELECT tc.constraint_name FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
                    AND LOWER(tc.table_name) = 'reserva' AND kcu.column_name = 'documento')
        LOOP EXECUTE format('ALTER TABLE "Reserva" DROP CONSTRAINT IF EXISTS %I', c.constraint_name); END LOOP;
    END $$;
    ALTER TABLE "Reserva"
        ADD CONSTRAINT "Reserva_documento_fkey"
        FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE;

    DO $$
    DECLARE c RECORD;
    BEGIN
        FOR c IN (SELECT tc.constraint_name FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
                    AND LOWER(tc.table_name) = 'comentarios' AND kcu.column_name = 'documento')
        LOOP EXECUTE format('ALTER TABLE "Comentarios" DROP CONSTRAINT IF EXISTS %I', c.constraint_name); END LOOP;
    END $$;
    ALTER TABLE "Comentarios"
        ADD CONSTRAINT "Comentarios_documento_fkey"
        FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE;

    -- 6) Restaurante.documento: cambiar FK de Dueno a Usuario
    DO $$
    DECLARE c RECORD;
    BEGIN
        FOR c IN (SELECT tc.constraint_name FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
                    AND LOWER(tc.table_name) = 'restaurante' AND kcu.column_name = 'documento')
        LOOP EXECUTE format('ALTER TABLE "Restaurante" DROP CONSTRAINT IF EXISTS %I', c.constraint_name); END LOOP;
    END $$;
    ALTER TABLE "Restaurante"
        ADD CONSTRAINT "Restaurante_documento_fkey"
        FOREIGN KEY (documento) REFERENCES "Usuario" (documento) ON DELETE CASCADE;

    -- 7) FK Usuario.nit -> Restaurante (para empleados)
    ALTER TABLE "Usuario"
        ADD CONSTRAINT fk_usuario_nit_restaurante
        FOREIGN KEY (nit) REFERENCES "Restaurante" (nit) ON DELETE SET NULL;

    -- 8) Eliminar tablas antiguas (orden por dependencias)
    DROP TABLE IF EXISTS "Empleado";
    DROP TABLE IF EXISTS "Dueno";
    DROP TABLE IF EXISTS "Cliente";

    -- Confirmación
    SELECT 'Migración cliente/dueno/empleado -> Usuario completada' AS status;
