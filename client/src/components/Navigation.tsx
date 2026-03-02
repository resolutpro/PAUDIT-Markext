import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Accessibility, Home, Map as MapIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AccessibilityModal from './AccessibilityModal';

export function Navigation() {
  const [location] = useLocation();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú de navegación">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">Inicio</Link>
                <Link href="/rutas" className="text-lg font-medium hover:text-primary transition-colors">Explorar Rutas</Link>
                <button 
                  onClick={() => setIsAccessModalOpen(true)}
                  className="text-left text-lg font-medium hover:text-primary transition-colors"
                >
                  Accesibilidad
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2" aria-label="Ir a la página de inicio">
            <span className="text-xl font-bold tracking-tight">PAUDIT</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Inicio</Link>
              <Link href="/rutas" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/rutas' ? 'text-primary' : 'text-muted-foreground'}`}>Rutas</Link>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAccessModalOpen(true)}
              aria-label="Configuración de accesibilidad"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-2 px-2"
            >
              <Accessibility className="h-5 w-5" />
              <span className="hidden sm:inline">Acceso</span>
            </Button>
          </div>
        </div>
      </header>

      <AccessibilityModal 
        isOpen={isAccessModalOpen} 
        onClose={() => setIsAccessModalOpen(false)} 
      />
    </>
  );
}
