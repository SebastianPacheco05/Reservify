/**
 * Radio de la Tierra en metros (aproximación esférica).
 */
const R = 6_371_000;

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine.
 * @param lat1 Latitud del primer punto (grados).
 * @param lng1 Longitud del primer punto (grados).
 * @param lat2 Latitud del segundo punto (grados).
 * @param lng2 Longitud del segundo punto (grados).
 * @returns Distancia en metros.
 */
export function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formatea una distancia en metros a una cadena legible (m o km).
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
