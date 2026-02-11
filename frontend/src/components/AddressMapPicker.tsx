"use client";

import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FALLBACK_CENTER: [number, number] = [4.6097, -74.0817]; // Bogotá

/** Centra el mapa cuando se obtiene la ubicación del usuario */
function MapCenterController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "es",
      "User-Agent": "ReservifyApp/1.0 (seleccion de direccion)",
    },
  });
  if (!res.ok) throw new Error("No se pudo obtener la dirección");
  const data = await res.json();
  return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function MapClickHandler({
  onPosition,
}: {
  onPosition: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPosition(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface AddressMapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
}

export function AddressMapPicker({ isOpen, onClose, onSelect }: AddressMapPickerProps) {
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setUserLocation(null);
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [isOpen]);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setMarker([lat, lng]);
    setAddress(null);
    setError(null);
    setLoading(true);
    try {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
    } catch (e) {
      setError("No se pudo obtener la dirección. Usa las coordenadas.");
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConfirm = () => {
    if (address) {
      onSelect(address);
      onClose();
      setMarker(null);
      setAddress(null);
    }
  };

  const handleClose = () => {
    setMarker(null);
    setAddress(null);
    setError(null);
    setUserLocation(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden z-[100]" showCloseButton={true}>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Elegir dirección en el mapa</DialogTitle>
          <DialogDescription>
            Haz clic en el mapa para colocar el marcador. La dirección se completará automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[360px] w-full bg-muted">
          <MapContainer
            center={userLocation ?? FALLBACK_CENTER}
            zoom={14}
            className="h-full w-full z-[1]"
            scrollWheelZoom
          >
            <MapCenterController center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />
            <MapClickHandler onPosition={handleMapClick} />
            {marker && (
              <Marker position={marker} icon={DefaultIcon} />
            )}
          </MapContainer>
          {(locationLoading || loading) && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/70">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {locationLoading ? "Obteniendo tu ubicación…" : "Obteniendo la dirección…"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t bg-muted/30">
          {error && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">{error}</p>
          )}
          {address && (
            <p className="text-sm font-medium text-foreground break-words">
              Dirección: {address}
            </p>
          )}
          {!marker && (
            <p className="text-sm text-muted-foreground">Haz clic en el mapa para elegir la ubicación.</p>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!address}>
            Usar esta dirección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
