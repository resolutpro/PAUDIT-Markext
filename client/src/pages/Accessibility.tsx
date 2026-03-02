import { Link } from 'wouter';
import { Shield, Keyboard, Eye, Ear, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';

export default function AccessibilityPage() {
  const { 
    textSize, setTextSize, 
    contrastMode, setContrastMode,
    enableSubtitles, setEnableSubtitles,
    preferEasyRead, setPreferEasyRead
  } = useAccessibility();

  return (
    <main id="main-content" className="pb-24 pt-6 container px-4 max-w-4xl mx-auto animate-in fade-in duration-300">
      <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground" asChild>
        <Link href="/">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver al inicio
        </Link>
      </Button>

      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-6">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Compromiso de Accesibilidad</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
          PAUDIT v1.0 ha sido diseñado y desarrollado siguiendo las pautas de accesibilidad WCAG 2.1 nivel AA para garantizar que todos los usuarios puedan disfrutar del patrimonio cultural.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Keyboard className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Navegación por Teclado</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Todo el sitio web puede ser operado utilizando únicamente el teclado. El orden de tabulación es lógico y todos los elementos interactivos tienen un foco visual claro.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Use <kbd className="font-mono bg-secondary px-1 rounded">Tab</kbd> para avanzar entre enlaces y botones.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Use <kbd className="font-mono bg-secondary px-1 rounded">Shift + Tab</kbd> para retroceder.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Use <kbd className="font-mono bg-secondary px-1 rounded">Enter</kbd> o <kbd className="font-mono bg-secondary px-1 rounded">Espacio</kbd> para activar elementos.</span>
            </li>
          </ul>
        </section>

        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Adaptabilidad Visual</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            El texto puede redimensionarse sin pérdida de contenido ni funcionalidad. Los colores han sido elegidos para mantener un contraste adecuado, y ofrecemos modos de alto contraste.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={textSize === 'xl' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTextSize('xl')}
            >
              Probar Texto XL
            </Button>
            <Button 
              variant={contrastMode === 'high-black' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setContrastMode('high-black')}
            >
              Probar Contraste
            </Button>
          </div>
        </section>

        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Ear className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Alternativas Multimedia</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Todo el contenido no textual tiene alternativas que cumplen el mismo propósito:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Transcripciones completas para todas las audioguías.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Vídeos en Lengua de Signos Española (LSE) con subtítulos.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Etiquetas ALT descriptivas en todas las imágenes relevantes.</span>
            </li>
          </ul>
        </section>

        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Lectura Fácil</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Proporcionamos versiones simplificadas del contenido para personas con dificultades de comprensión lectora, apoyadas con iconografía clara y estructura simplificada.
          </p>
          <Button 
            variant={preferEasyRead ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreferEasyRead(!preferEasyRead)}
          >
            {preferEasyRead ? 'Desactivar Lectura Fácil' : 'Activar Lectura Fácil'}
          </Button>
        </section>
      </div>

      <section className="bg-secondary/30 rounded-2xl p-8 border border-border/50 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Contacto de Accesibilidad</h2>
        <p className="text-muted-foreground mb-6">
          Si encuentras alguna barrera de accesibilidad o tienes sugerencias de mejora, nos encantaría escucharte. Trabajamos continuamente para mejorar la experiencia de todos nuestros usuarios.
        </p>
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <a href="mailto:accesibilidad@paudit.com">accesibilidad@paudit.com</a>
        </Button>
      </section>
    </main>
  );
}
