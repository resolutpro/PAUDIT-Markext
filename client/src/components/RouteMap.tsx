import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Arreglo para los iconos de Leaflet en React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface RouteMapProps {
  stops: { id: number; title: string; coordinates?: [number, number] }[];
}

export function RouteMap({ stops }: RouteMapProps) {
  // Filtramos solo las paradas que tienen coordenadas válidas
  const validStops = stops.filter(
    (stop) => stop.coordinates && stop.coordinates.length === 2,
  );

  if (validStops.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        No hay coordenadas disponibles
      </div>
    );
  }

  // Calculamos el centro del mapa basándonos en la primera parada
  const center = validStops[0].coordinates!;

  // Extraemos solo las coordenadas para dibujar la línea de la ruta
  const routeLine = validStops.map((stop) => stop.coordinates!);

  return (
    <MapContainer
      center={center}
      zoom={15}
      className="w-full h-full z-0 rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dibuja una línea conectando las paradas */}
      <Polyline
        positions={routeLine}
        color="hsl(var(--primary))"
        weight={4}
        opacity={0.7}
      />

      {/* Dibuja los marcadores */}
      {validStops.map((stop, index) => (
        <Marker key={stop.id} position={stop.coordinates!}>
          <Popup>
            <strong>
              {index + 1}. {stop.title}
            </strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
