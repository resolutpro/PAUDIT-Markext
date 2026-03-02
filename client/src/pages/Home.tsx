import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Search, Info, Ear, HandMetal, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

export default function Home() {
  const [routes, setRoutes] = useState<RouteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredRoutes = routes.filter(route => 
    route.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.municipality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main id="main-content" className="pb-24 md:pb-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-b-3xl md:rounded-3xl md:mt-4 md:mx-4 mx-0 mb-8 max-w-[calc(100%-2rem)] md:max-w-6xl md:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop" 
          alt="Antigua arquitectura romana" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 max-w-2xl leading-tight text-shadow">
            Explora el Patrimonio Cultural
          </h1>
          <p className="text-lg text-white/90 mb-6 max-w-xl text-shadow-sm">
            Rutas accesibles por monumentos e historia adaptadas para todos.
          </p>
          
          <div className="w-full max-w-md relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar rutas o municipios..." 
              className="w-full pl-10 pr-12 h-12 text-base rounded-full bg-background/95 backdrop-blur border-none shadow-lg text-foreground placeholder:text-muted-foreground/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar rutas"
            />
            <Button size="icon" className="absolute right-1 h-10 w-10 rounded-full" aria-label="Ejecutar búsqueda">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="container px-4 max-w-6xl mx-auto space-y-8">
        
        {/* Featured Routes */}
        <section aria-labelledby="featured-routes-title">
          <div className="flex items-center justify-between mb-6">
            <h2 id="featured-routes-title" className="text-2xl font-bold">Rutas Destacadas</h2>
            <Link href="/rutas" className="text-primary font-medium hover:underline">Ver todas</Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 rounded-2xl bg-card animate-pulse"></div>
              <div className="h-64 rounded-2xl bg-card animate-pulse"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoutes.length > 0 ? filteredRoutes.map((route, idx) => (
                <Link key={route.id} href={`/rutas/${route.slug}`}>
                  <a className="group block relative overflow-hidden rounded-2xl bg-card hover-elevate transition-all border border-border/50">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                      <img 
                        src={route.image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        aria-hidden="true"
                      />
                      {idx === 0 && (
                        <div className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          Más Popular
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{route.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{route.municipality} • {route.duration}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-2 text-primary" aria-label="Recursos de accesibilidad disponibles">
                          {route.flags.audio && <Ear className="h-5 w-5" aria-label="Audioguía" />}
                          {route.flags.lse && <HandMetal className="h-5 w-5" aria-label="Lengua de Signos" />}
                          {route.flags.easyRead && <BookOpen className="h-5 w-5" aria-label="Lectura Fácil" />}
                        </div>
                        <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">{route.stopCount} paradas</span>
                      </div>
                    </div>
                  </a>
                </Link>
              )) : (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-2xl">
                  No se encontraron rutas con esa búsqueda.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Accessibility Info Banner */}
        <section className="bg-secondary/50 rounded-2xl p-6 border border-border/50 mt-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
            <Info className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Experiencia Accesible</h2>
            <p className="text-muted-foreground">
              Todas nuestras rutas están diseñadas siguiendo las directrices WCAG AA. Incluyen audioguías con transcripción, vídeos en LSE y textos adaptables a tus preferencias.
            </p>
          </div>
          <Button className="sm:ml-auto whitespace-nowrap" asChild>
            <Link href="/accesibilidad">Saber más</Link>
          </Button>
        </section>

      </div>
    </main>
  );
}
