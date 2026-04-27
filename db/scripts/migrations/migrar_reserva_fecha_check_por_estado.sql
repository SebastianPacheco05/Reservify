-- Permite actualizar reservas pasadas a estados de cierre/cancelación
-- sin romper la validación de fecha.
ALTER TABLE "Reserva"
DROP CONSTRAINT IF EXISTS "Reserva_fecha_check";

ALTER TABLE "Reserva"
ADD CONSTRAINT "Reserva_fecha_check"
CHECK (
    fecha >= CURRENT_DATE
    OR estado_reserva IN ('cancelada', 'finalizada', 'no presentada')
) NOT VALID;
