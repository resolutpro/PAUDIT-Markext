import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Ear, HandMetal, BookOpen, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RouteSummary {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  summary: string;
  image: string;
  stopCount: number;
  duration: string;
  flags: {
    audio: boolean;
    lse: boolean;
    easyRead: boolean;
  };
}

export default function RouteList() {
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => {
        setRoutes(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading routes:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main id="main-content" className="pb-24 md:pb-12 pt-6 container px-4 max-w-5xl mx-auto animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Explorar Rutas</h1>
        <p className="text-lg text-muted-foreground">
          Descubre el patrimonio cultural a tu propio ritmo con contenido 100% accesible.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col md:flex-row gap-4 h-auto md:h-48 rounded-2xl bg-card border border-border p-4 animate-pulse">
              <div className="w-full md:w-64 h-48 md:h-full bg-secondary rounded-xl" />
              <div className="flex-1 py-2 space-y-4">
                <div className="h-6 w-3/4 bg-secondary rounded" />
                <div className="h-4 w-1/4 bg-secondary rounded" />
                <div className="h-16 w-full bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6" role="list" aria-label="Lista de rutas culturales">
          {routes.map((route) => (
            <article 
              key={route.id} 
              className="group flex flex-col md:flex-row gap-0 md:gap-6 bg-card border border-border/50 rounded-2xl overflow-hidden hover-elevate transition-all"
              role="listitem"
            >
              <div className="w-full md:w-72 h-56 md:h-auto shrink-0 relative overflow-hidden">
                <img 
                  src={route.image} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  aria-hidden="true"
                />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {route.municipality}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {route.duration}</span>
                  <span>•</span>
                  <span>{route.stopCount} paradas</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  <Link href={`/rutas/${route.slug}`} className="focus-visible:outline-none focus-visible:underline">
                    {route.title}
                  </Link>
                </h2>
                
                <p className="text-muted-foreground mb-6 flex-1 line-clamp-3 md:line-clamp-2">
                  {route.summary}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                  <div className="flex gap-3 text-primary bg-primary/10 px-3 py-1.5 rounded-lg" aria-label="Recursos de accesibilidad disponibles">
                    {route.flags.audio && <div className="flex items-center gap-1.5" title="Audioguía disponible"><Ear className="h-4 w-4" /><span className="text-xs font-semibold sr-only md:not-sr-only">Audio</span></div>}
                    {route.flags.lse && <div className="flex items-center gap-1.5" title="Vídeo LSE disponible"><HandMetal className="h-4 w-4" /><span className="text-xs font-semibold sr-only md:not-sr-only">LSE</span></div>}
                    {route.flags.easyRead && <div className="flex items-center gap-1.5" title="Lectura Fácil disponible"><BookOpen className="h-4 w-4" /><span className="text-xs font-semibold sr-only md:not-sr-only">Lectura Fácil</span></div>}
                  </div>
                  
                  <Button asChild>
                    <Link href={`/rutas/${route.slug}`}>
                      Ver ruta
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
