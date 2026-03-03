import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Componente auxiliar para ajustar los límites del mapa y fijar el zoom mínimo
function MapBoundsFit({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      // Ajusta el mapa para que se vean todas las paradas (con un pequeño margen de padding)
      map.fitBounds(bounds, { padding: [40, 40] });

      // Una vez encuadrado, le decimos al mapa que el nivel de zoom actual sea el mínimo permitido
      // Así el usuario no puede hacer zoom hacia atrás (alejarse más)
      const currentZoom = map.getZoom();
      map.setMinZoom(currentZoom);
    }
  }, [map, bounds]);

  return null;
}

interface RouteMapProps {
  stops: { id: number; title: string; coordinates?: [number, number] }[];
}

export function RouteMap({ stops }: RouteMapProps) {
  // Filtramos solo las paradas que tienen coordenadas válidas
  const validStops = useMemo(
    () =>
      stops.filter((stop) => stop.coordinates && stop.coordinates.length === 2),
    [stops],
  );

  if (validStops.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
        No hay coordenadas disponibles para esta ruta.
      </div>
    );
  }

  // Extraemos las coordenadas para la línea y los límites del mapa
  const routeLine = validStops.map((stop) => stop.coordinates!);
  const bounds = L.latLngBounds(routeLine);

  // Función para crear un icono numerado usando divIcon de Leaflet
  const createNumberedIcon = (number: number) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px; margin-top: -13px; margin-left: -13px;">${number}</div>`,
      iconSize: [0, 0], // El tamaño real lo da el div en el html
      iconAnchor: [0, 0], // Centrado exacto basado en el margin-top/left del div
    });
  };

  return (
    <MapContainer
      className="w-full h-full z-0 rounded-2xl"
      // Quitamos center y zoom fijos porque los maneja MapBoundsFit
    >
      <MapBoundsFit bounds={bounds} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dibuja una línea conectando las paradas */}
      <Polyline
        positions={routeLine}
        color="hsl(var(--primary))"
        weight={4}
        opacity={0.6}
        dashArray="10, 10" // Opcional: hace que la línea sea punteada, puedes quitarlo si la prefieres continua
      />

      {/* Dibuja los marcadores numerados */}
      {validStops.map((stop, index) => (
        <Marker
          key={stop.id}
          position={stop.coordinates!}
          icon={createNumberedIcon(index + 1)}
        >
          <Popup>
            <strong className="text-sm">
              {index + 1}. {stop.title}
            </strong>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
