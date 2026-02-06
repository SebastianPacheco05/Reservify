import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { haversineDistanceMeters, formatDistance } from "../lib/haversine";
import "leaflet/dist/leaflet.css";

/* Fix: iconos de Leaflet en Vite (rutas de imágenes en compilación) */
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://10.5.213.111:1106";

const FALLBACK_CENTER = { lat: 4.6097, lng: -74.0817 }; // Bogotá

export interface RestauranteMapItem {
  nit: number;
  nombre_restaurante: string;
  direccion?: string;
  lat: number;
  lng: number;
}

interface UserCoords {
  lat: number;
  lng: number;
}

type LocationStatus = "idle" | "asking" | "granted" | "denied" | "unsupported";

/** Ajusta el mapa al centro cuando cambian las coordenadas del usuario */
function MapCenterController({ center }: { center: UserCoords | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function RestaurantMap() {
  const [userCoords, setUserCoords] = useState<UserCoords | null>(FALLBACK_CENTER);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [restaurantes, setRestaurantes] = useState<RestauranteMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      setError("Tu navegador no soporta geolocalización.");
      setUserCoords(FALLBACK_CENTER);
      return;
    }
    setLocationStatus("asking");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: UserCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setLocationStatus("granted");
      },
      (err) => {
        setLocationStatus("denied");
        const isSecure = typeof window !== "undefined" && window.isSecureContext;
        const msg = !isSecure
          ? "La ubicación suele requerir HTTPS en el celular. Prueba abrir la app con https:// o desde un enlace seguro."
          : "No se pudo obtener tu ubicación. Revisa que hayas permitido el acceso en el navegador.";
        setError(msg);
        setUserCoords(FALLBACK_CENTER);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  // No pedir ubicación al cargar: en móvil el permiso debe ser tras un gesto del usuario (tap).
  // Así el navegador muestra el diálogo de permisos cuando tocan "Usar mi ubicación".

  useEffect(() => {
    const lat = userCoords?.lat ?? FALLBACK_CENTER.lat;
    const lng = userCoords?.lng ?? FALLBACK_CENTER.lng;

    const controller = new AbortController();
    setLoading(true);
    if (error && error.includes("cargar restaurantes")) setError(null);

    fetch(`${API_BASE_URL}/restaurantes?lat=${lat}&lng=${lng}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar restaurantes");
        return res.json();
      })
      .then((data: RestauranteMapItem[] | { respuesta?: RestauranteMapItem[] }) => {
        const list = Array.isArray(data) ? data : data?.respuesta ?? [];
        if (list.length && typeof list[0]?.lat === "undefined") {
          setRestaurantes(
            list.map((r: RestauranteMapItem & { lat?: number; lng?: number }, i: number) => ({
              ...r,
              lat: (r.lat ?? lat) + (i * 0.002) * Math.cos(i),
              lng: (r.lng ?? lng) + (i * 0.002) * Math.sin(i),
            }))
          );
        } else {
          setRestaurantes(list as RestauranteMapItem[]);
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || "Error al cargar restaurantes");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [userCoords?.lat, userCoords?.lng]);

  const center = userCoords ?? FALLBACK_CENTER;
  const isSecure = typeof window !== "undefined" && window.isSecureContext;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border">
      {locationStatus === "idle" && (
        <div className="bg-primary/10 text-foreground px-4 py-3 text-sm flex flex-col gap-2">
          <p className="font-medium">Para centrar el mapa en tu ubicación (GPS)</p>
          <p className="text-muted-foreground text-xs">
            Toca el botón de abajo. El navegador te pedirá permiso para usar tu ubicación.
            {!isSecure && " En el celular suele ser necesario usar la página con HTTPS."}
          </p>
          <button
            type="button"
            onClick={requestLocation}
            className="self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 touch-manipulation"
          >
            Usar mi ubicación
          </button>
        </div>
      )}
      {locationStatus === "asking" && (
        <div className="bg-muted/50 text-muted-foreground px-4 py-2 text-sm">
          Solicitando acceso a tu ubicación… Acepta el permiso en tu navegador o celular.
        </div>
      )}
      {locationStatus === "denied" || locationStatus === "unsupported" ? (
        <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
          <span>
            {locationStatus === "unsupported"
              ? "Tu navegador no soporta GPS."
              : error || "Ubicación no permitida. El mapa usa una ubicación por defecto."}
          </span>
          <button
            type="button"
            onClick={requestLocation}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 touch-manipulation"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : null}
      {error && locationStatus !== "denied" && locationStatus !== "unsupported" && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 text-sm">
          {error}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
          <span className="text-muted-foreground">Cargando mapa...</span>
        </div>
      )}
      <div className="relative h-[500px] w-full">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom
        >
          <MapCenterController center={userCoords} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userCoords && locationStatus === "granted" && (
            <CircleMarker
              center={[userCoords.lat, userCoords.lng]}
              radius={10}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#3b82f6",
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Popup>Tu ubicación (GPS)</Popup>
            </CircleMarker>
          )}
          {restaurantes.map((r) => (
            <Marker key={r.nit} position={[r.lat, r.lng]}>
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-foreground">{r.nombre_restaurante}</p>
                  {userCoords && locationStatus === "granted" && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {formatDistance(
                        haversineDistanceMeters(userCoords.lat, userCoords.lng, r.lat, r.lng)
                      )}
                    </p>
                  )}
                  <Link
                    to={`/Restaurant?nit=${r.nit}`}
                    className="mt-2 inline-block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Ver disponibilidad
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute bottom-6 right-4 z-[1000]">
          <button
            type="button"
            onClick={requestLocation}
            className="rounded-lg bg-background border border-border px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted touch-manipulation"
            title="Centrar mapa en mi ubicación GPS"
          >
            Centrar en mi ubicación
          </button>
        </div>
      </div>
    </div>
  );
}
