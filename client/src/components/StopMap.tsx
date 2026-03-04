import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

// Componente auxiliar para animar la cámara del mapa
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 17, { duration: 1.5 });
  }, [center, map]);
  return null;
}

interface StopMapProps {
  coordinates: [number, number];
  stopTitle: string;
}

export function StopMap({ coordinates, stopTitle }: StopMapProps) {
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(coordinates);

  useEffect(() => {
    if (!navigator.geolocation) return;

    // watchPosition rastrea la ubicación en tiempo real
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error("Error obteniendo ubicación:", err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const centerOnUser = () => {
    if (userLoc) setMapCenter(userLoc);
  };

  const centerOnStop = () => {
    setMapCenter(coordinates);
  };

  // Icono para la parada
  const stopIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: hsl(var(--primary)); color: white; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4); font-size: 14px;">📍</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

  // Icono (punto azul) para el usuario
  const userIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden shadow-sm border border-border/50">
      <MapContainer center={mapCenter} zoom={17} className="w-full h-full z-0">
        <MapUpdater center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador de la Parada */}
        <Marker position={coordinates} icon={stopIcon}>
          <Popup>
            <strong>{stopTitle}</strong>
          </Popup>
        </Marker>

        {/* Marcador del Usuario */}
        {userLoc && (
          <Marker position={userLoc} icon={userIcon}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Botones para centrar la cámara */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md bg-background/90 backdrop-blur"
          onClick={centerOnStop}
          aria-label="Centrar en la parada"
        >
          📍
        </Button>
        {userLoc && (
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md bg-background/90 backdrop-blur"
            onClick={centerOnUser}
            aria-label="Centrar en mi ubicación"
          >
            <Navigation className="h-5 w-5 text-blue-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
