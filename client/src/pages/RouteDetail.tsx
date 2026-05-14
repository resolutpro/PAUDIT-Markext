import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import {
  ChevronLeft,
  Map as MapIcon,
  Route as RouteIcon,
  Clock,
  Navigation,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteMap } from "@/components/RouteMap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Stop {
  id: number;
  title: string;
  imageUrl: string;
  imageAlt: string;
  text: string;
  coordinates?: [number, number]; // [latitud, longitud]
}

interface RouteData {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  distance?: string;
  duration?: string;
  difficulty?: string;
  pdfGuide?: string; // NUEVO CAMPO: Ruta al PDF opcional
  stops: Stop[];
}

export default function RouteDetail() {
  const [, params] = useRoute("/rutas/:slug");
  const slug = params?.slug;

  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    fetch(`/api/routes/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ruta no encontrada");
        return res.json();
      })
      .then((data) => {
        setRouteData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading route details:", err);
        setError(true);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto p-4 pt-8 animate-pulse space-y-6">
        <div className="h-8 w-24 bg-card rounded" />
        <div className="h-64 w-full bg-card rounded-2xl" />
        <div className="flex gap-4">
          <div className="h-20 flex-1 bg-card rounded-xl" />
          <div className="h-20 flex-1 bg-card rounded-xl" />
          <div className="h-20 flex-1 bg-card rounded-xl" />
        </div>
        <div className="space-y-4 pt-8">
          <div className="h-8 w-48 bg-card rounded" />
          <div className="h-24 w-full bg-card rounded-xl" />
          <div className="h-24 w-full bg-card rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !routeData) {
    return (
      <div className="container max-w-md mx-auto p-8 text-center pt-20">
        <h1 className="text-2xl font-bold mb-4">Ruta no encontrada</h1>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, no hemos podido cargar la información de esta ruta.
        </p>
        <Button asChild>
          <Link href="/rutas">Volver a rutas</Link>
        </Button>
      </div>
    );
  }

  const distance = routeData.distance || "No especificada";
  const duration = routeData.duration || "No especificada";
  const difficulty = routeData.difficulty || "No especificado";

  return (
    <main id="main-content" className="pb-24 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border/50 px-4 h-16 flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/rutas" aria-label="Volver al listado de rutas">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>

        <div className="text-center flex-1 truncate px-2">
          <h1 className="text-base font-bold truncate">{routeData.title}</h1>
          <p className="text-xs text-primary font-medium">PAUDIT V1.0</p>
        </div>

        {/* Espaciador invisible para mantener el título centrado al quitar el botón */}
        <div className="w-10"></div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-6">
        {/* BLOQUE CONDICIONAL: AVISO Y DESCARGA DEL PDF */}
        {routeData.pdfGuide && (
          <section className="mb-6">
            <Alert
              variant="default"
              className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300 font-bold ml-2">
                Importante para tu seguridad y accesibilidad
              </AlertTitle>
              <AlertDescription className="mt-2 text-amber-700 dark:text-amber-400/90">
                <p className="mb-4">
                  El mapa interactivo muestra la ubicación de las paradas, pero
                  el trazado generado automáticamente por el GPS
                  <strong> puede no ser 100% accesible</strong> al no detectar
                  barreras arquitectónicas o calles con mucha pendiente.
                </p>
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-amber-200/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Para garantizar una experiencia sin barreras, te
                      recomendamos descargar y seguir el trazado verificado por
                      <strong> Plena Inclusión Xerez</strong>.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 gap-2"
                  >
                    <a
                      href={routeData.pdfGuide}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4" />
                      Descargar Guía PDF
                    </a>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </section>
        )}

        {/* Mapa interactivo */}
        <div className="w-full h-64 md:h-80 border border-border/50 rounded-2xl mb-6 relative overflow-hidden shadow-sm">
          <RouteMap stops={routeData.stops} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <RouteIcon className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground mb-1">
              Distancia
            </span>
            <span className="font-bold text-lg leading-none">{distance}</span>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <Clock className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground mb-1">Duración</span>
            <span className="font-bold text-lg leading-none">{duration}</span>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <Navigation className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground mb-1">Nivel</span>
            <span className="font-bold text-lg leading-none">{difficulty}</span>
          </div>
        </div>

        {/* Stops List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Paradas en Orden</h2>
            <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
              {routeData.stops.length} Paradas
            </span>
          </div>

          <ul className="space-y-3">
            {routeData.stops.map((stop, index) => (
              <li key={stop.id}>
                <Link
                  href={`/rutas/${slug}/${stop.id}`}
                  className="group flex items-center p-3 pr-4 bg-card border border-border/50 hover:border-primary/50 rounded-xl transition-all"
                >
                  <div className="relative mr-4 shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={stop.imageUrl}
                        alt={
                          stop.imageAlt ||
                          `Fotografía representativa de ${stop.title}`
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-background">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                      {stop.title}
                    </h3>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>{" "}
                        Audio
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>{" "}
                        LSE
                      </span>
                    </div>
                  </div>

                  <ChevronLeft className="h-5 w-5 rotate-180 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 md:bottom-auto w-full md:w-auto md:sticky bg-background/95 backdrop-blur border-t border-border/50 p-4 z-30 pb-safe pb-20 md:pb-4 flex justify-center">
        <Button
          size="lg"
          className="w-full max-w-md h-14 text-lg font-bold shadow-lg gap-2"
          asChild
        >
          <Link href={`/rutas/${slug}/0`}>
            <Navigation className="h-5 w-5" />
            Empezar Ruta
          </Link>
        </Button>
      </div>
    </main>
  );
}
