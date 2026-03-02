import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ChevronLeft, Share2, Map as MapIcon, Route as RouteIcon, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Stop {
  id: number;
  title: string;
  imageUrl: string;
  imageAlt: string;
  text: string;
}

interface RouteData {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  stops: Stop[];
}

export default function RouteDetail() {
  const [, params] = useRoute('/rutas/:slug');
  const slug = params?.slug;
  
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    setIsLoading(true);
    fetch(`/content/routes/${slug}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Ruta no encontrada');
        return res.json();
      })
      .then(data => {
        setRouteData(data);
        setIsLoading(false);
      })
      .catch(err => {
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
        <p className="text-muted-foreground mb-8">Lo sentimos, no hemos podido cargar la información de esta ruta.</p>
        <Button asChild>
          <Link href="/rutas">Volver a rutas</Link>
        </Button>
      </div>
    );
  }

  // Placeholder static values since we don't have these in the detailed JSON yet
  const distance = "4.2 km";
  const duration = "1h 15m";
  const difficulty = "Fácil";

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
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Compartir ruta">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-6">
        {/* Map/Hero Placeholder */}
        <div className="w-full h-48 md:h-64 bg-card border border-border/50 rounded-2xl mb-6 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center"></div>
          <MapIcon className="h-10 w-10 mb-2 relative z-10" />
          <span className="font-medium relative z-10">Mapa interactivo de la ruta</span>
          <span className="text-xs relative z-10">(Opcional según especificaciones)</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <RouteIcon className="h-5 w-5 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground mb-1">Distancia</span>
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
            <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">{routeData.stops.length} Paradas</span>
          </div>

          <div className="space-y-3" role="list">
            {routeData.stops.map((stop, index) => (
              <Link key={stop.id} href={`/rutas/${slug}/${stop.id}`}>
                <a className="group flex items-center p-3 pr-4 bg-card border border-border/50 hover:border-primary/50 rounded-xl transition-all" role="listitem">
                  <div className="relative mr-4 shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={stop.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-background">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">{stop.title}</h3>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span> Audio</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span> LSE</span>
                    </div>
                  </div>
                  
                  <ChevronLeft className="h-5 w-5 rotate-180 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 md:bottom-auto w-full md:w-auto md:sticky bg-background/95 backdrop-blur border-t border-border/50 p-4 z-30 pb-safe pb-20 md:pb-4 flex justify-center">
        <Button size="lg" className="w-full max-w-md h-14 text-lg font-bold shadow-lg gap-2" asChild>
          <Link href={`/rutas/${slug}/1`}>
            <Navigation className="h-5 w-5" />
            Empezar Ruta
          </Link>
        </Button>
      </div>
    </main>
  );
}
