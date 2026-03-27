import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  Marker,
  useMap,
} from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import {
  fetchRestaurantesMap,
  normalizeMapQueryCoords,
  type RestauranteMapItem,
} from "../api/fetchRestaurantesMap";
import { formatDistance, haversineDistanceMeters } from "../lib/haversine";

const FALLBACK_CENTER = { lat: 4.6097, lng: -74.0817 }; // Bogot?

interface UserCoords {
  lat: number;
  lng: number;
}

type LocationStatus = "idle" | "asking" | "granted" | "denied" | "unsupported";

interface RestaurantMapProps {
  onlyNit?: number;
  initialCenter?: { lat: number; lng: number } | null;
  mapHeightClassName?: string;
}

function MapCenterController({ center }: { center: UserCoords | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

export type { RestauranteMapItem };

export default function RestaurantMap({
  onlyNit,
  initialCenter,
  mapHeightClassName = "h-[500px]",
}: RestaurantMapProps) {
  const defaultCenter =
    initialCenter &&
      typeof initialCenter.lat === "number" &&
      typeof initialCenter.lng === "number"
      ? normalizeMapQueryCoords(initialCenter.lat, initialCenter.lng)
      : FALLBACK_CENTER;

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [mapCenter, setMapCenter] = useState<UserCoords | null>(defaultCenter);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [geoError, setGeoError] = useState<string | null>(null);

  const queryCoords = useMemo(() => {
    const lat = userCoords?.lat ?? defaultCenter.lat;
    const lng = userCoords?.lng ?? defaultCenter.lng;
    return normalizeMapQueryCoords(lat, lng);
  }, [userCoords, defaultCenter.lat, defaultCenter.lng]);

  const {
    data: restaurantes = [],
    isPending,
    isFetching,
    error: queryError,
  } = useQuery({
    queryKey: ["restaurantes", "map", queryCoords.lat, queryCoords.lng],
    queryFn: () => fetchRestaurantesMap(queryCoords.lat, queryCoords.lng),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const loadingMapData = isPending || (isFetching && restaurantes.length === 0);
  const fetchErrorMessage =
    queryError instanceof Error ? queryError.message : queryError ? String(queryError) : null;

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      setGeoError("Tu navegador no soporta geolocalizaci?n.");
      setUserCoords(FALLBACK_CENTER);
      return;
    }
    setLocationStatus("asking");
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: UserCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setMapCenter(coords);
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
        const isSecure = typeof window !== "undefined" && window.isSecureContext;
        const msg = !isSecure
          ? "La ubicaci?n suele requerir HTTPS en el celular. Prueba abrir la app con https:// o desde un enlace seguro."
          : "No se pudo obtener tu ubicaci?n. Revisa que hayas permitido el acceso en el navegador.";
        setGeoError(msg);
        setUserCoords(FALLBACK_CENTER);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, []);

  const displayedRestaurantes = useMemo(
    () => (onlyNit ? restaurantes.filter((r) => r.nit === onlyNit) : restaurantes),
    [onlyNit, restaurantes],
  );

  useEffect(() => {
    if (onlyNit && displayedRestaurantes.length > 0) {
      const r = displayedRestaurantes[0];
      setMapCenter({ lat: r.lat, lng: r.lng });
    }
  }, [onlyNit, displayedRestaurantes]);

  const center = mapCenter ?? FALLBACK_CENTER;
  const isSecure = typeof window !== "undefined" && window.isSecureContext;

  return (
    <div className="relative w-full rounded-4xl overflow-hidden">
      {locationStatus === "idle" && !onlyNit && (
        <div className="dark:bg-neutral-800 bg-neutral-200 text-foreground px-4 py-3 text-sm flex flex-col gap-2">
          <p className="font-medium dark:text-white ">Para centrar el mapa en tu ubicaci?n</p>
          <p className="text-muted-foreground text-xs">
            Toca el bot?n de abajo. El navegador te pedir? permiso para usar tu ubicaci?n.
            {!isSecure && " En el celular suele ser necesario usar la p?gina con HTTPS."}
          </p>
          <button
            type="button"
            onClick={requestLocation}
            className="self-start rounded-lg dark:bg-neutral-50 bg-primary dark:text-black px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 touch-manipulation"
          >
            Usar mi ubicaci?n
          </button>
        </div>
      )}
      {locationStatus === "asking" && (
        <div className="bg-muted/ text-muted-foreground px-4 py-2 text-sm">
          Solicitando acceso a tu ubicaci?n? Acepta el permiso en tu navegador o celular.
        </div>
      )}
      {locationStatus === "denied" || locationStatus === "unsupported" ? (
        <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
          <span>
            {locationStatus === "unsupported"
              ? "Tu navegador no soporta GPS."
              : geoError || "Ubicaci?n no permitida. El mapa usa una ubicaci?n por defecto."}
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
      {fetchErrorMessage &&
        locationStatus !== "denied" &&
        locationStatus !== "unsupported" && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 text-sm">{fetchErrorMessage}</div>
        )}
      {loadingMapData && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
          <span className="text-muted-foreground">Cargando mapa...</span>
        </div>
      )}
      <div className={`relative w-full ${mapHeightClassName}`}>
        <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full" scrollWheelZoom>
          <MapCenterController center={mapCenter} />
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
              <Popup>Tu ubicaci?n (GPS)</Popup>
            </CircleMarker>
          )}
          {displayedRestaurantes.map((r) => (
            <Marker key={r.nit} position={[r.lat, r.lng]}>
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-foreground">{r.nombre_restaurante}</p>
                  {userCoords && locationStatus === "granted" && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {formatDistance(
                        haversineDistanceMeters(userCoords.lat, userCoords.lng, r.lat, r.lng),
                      )}
                    </p>
                  )}
                  {r.restaurante_uid ? (
                    <Link
                      to={`/Restaurant?uid=${encodeURIComponent(r.restaurante_uid)}`}
                      className="mt-2 inline-block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Ver disponibilidad
                    </Link>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">Ficha no disponible</p>
                  )}
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
            title="Centrar mapa en mi ubicaci?n GPS"
          >
            Centrar en mi ubicaci?n
          </button>
        </div>
      </div>
    </div>
  );
}
