/**
 * Fecha en formato YYYY-MM-DD completa y existente en calendario.
 * Evita peticiones al backend mientras el usuario escribe o pega valores incompletos.
 */
export function isCompleteISODate(value: string): boolean {
  const s = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map((x) => Number.parseInt(x, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;
  const check = new Date(y, m - 1, d);
  return (
    check.getFullYear() === y &&
    check.getMonth() === m - 1 &&
    check.getDate() === d
  );
}
