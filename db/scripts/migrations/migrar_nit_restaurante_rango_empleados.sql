-- Corrige NIT de restaurantes fuera del rango requerido para empleados (9000000000–99999999999)
-- y alinea con Usuario.nit (CHECK nit > 8999999999). Idempotente: solo actúa si hay filas inválidas.
-- Requiere permisos para DROP/ADD FKs sobre Mesas, Encabezado_Factura, Calculos_mensuales.

DO $$
DECLARE
  r RECORD;
  v_base BIGINT;
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Restaurante" WHERE nit < 9000000000 OR nit > 99999999999
  ) THEN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Mesas_nit_fkey') THEN
    ALTER TABLE "Mesas" DROP CONSTRAINT "Mesas_nit_fkey";
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Encabezado_Factura_nit_fkey') THEN
    ALTER TABLE "Encabezado_Factura" DROP CONSTRAINT "Encabezado_Factura_nit_fkey";
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Calculos_mensuales_nit_fkey') THEN
    ALTER TABLE "Calculos_mensuales" DROP CONSTRAINT "Calculos_mensuales_nit_fkey";
  END IF;

  SELECT COALESCE(MAX(nit), 8999999999) INTO v_base
  FROM "Restaurante"
  WHERE nit >= 9000000000 AND nit <= 99999999999;

  FOR r IN
    SELECT restaurante_uid, nit
    FROM "Restaurante"
    WHERE nit < 9000000000 OR nit > 99999999999
    ORDER BY restaurante_uid
  LOOP
    v_base := v_base + 1;
    WHILE v_base > 99999999999 OR EXISTS (SELECT 1 FROM "Restaurante" WHERE nit = v_base) LOOP
      v_base := v_base + 1;
    END LOOP;

    UPDATE "Mesas" SET nit = v_base WHERE nit = r.nit;
    UPDATE "Encabezado_Factura" SET nit = v_base WHERE nit = r.nit;
    UPDATE "Calculos_mensuales" SET nit = v_base WHERE nit = r.nit;
    UPDATE "Usuario" SET nit = v_base WHERE nit = r.nit;
    UPDATE "Restaurante" SET nit = v_base WHERE restaurante_uid = r.restaurante_uid;
  END LOOP;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Mesas_nit_fkey'
  ) THEN
    ALTER TABLE "Mesas"
    ADD CONSTRAINT "Mesas_nit_fkey"
    FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Encabezado_Factura_nit_fkey'
  ) THEN
    ALTER TABLE "Encabezado_Factura"
    ADD CONSTRAINT "Encabezado_Factura_nit_fkey"
    FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Calculos_mensuales_nit_fkey'
  ) THEN
    ALTER TABLE "Calculos_mensuales"
    ADD CONSTRAINT "Calculos_mensuales_nit_fkey"
    FOREIGN KEY (nit) REFERENCES "Restaurante"(nit) ON DELETE CASCADE;
  END IF;
  ELSE
    RAISE NOTICE 'migrar_nit_restaurante_rango_empleados: sin filas a corregir.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'restaurante_nit_rango_empleados_check'
      AND conrelid = '"Restaurante"'::regclass
  ) THEN
    ALTER TABLE "Restaurante"
    ADD CONSTRAINT restaurante_nit_rango_empleados_check
    CHECK (nit >= 9000000000 AND nit <= 99999999999);
  END IF;
END $$;
