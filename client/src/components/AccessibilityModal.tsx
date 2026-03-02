import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Type, Moon, Sun, Subtitles, BookOpen, Undo2 } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityModal({ isOpen, onClose }: AccessibilityModalProps) {
  const { 
    textSize, setTextSize, 
    contrastMode, setContrastMode,
    enableSubtitles, setEnableSubtitles,
    preferEasyRead, setPreferEasyRead,
    resetToDefault
  } = useAccessibility();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Accesibilidad</DialogTitle>
          <Button variant="ghost" size="sm" onClick={resetToDefault} className="text-primary gap-2 h-8">
            <Undo2 className="h-4 w-4" />
            Restablecer
          </Button>
        </DialogHeader>

        <div className="grid gap-8 py-4">
          {/* Text Size */}
          <section role="group" aria-labelledby="text-size-heading">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Type className="h-5 w-5" />
              <h3 id="text-size-heading" className="text-lg font-semibold">Tamaño de Texto</h3>
            </div>
            <div className="flex bg-secondary rounded-lg p-1">
              {(['small', 'large', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    textSize === size 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                  aria-pressed={textSize === size}
                >
                  {size === 'small' ? 'NORMAL' : size === 'large' ? 'GRANDE' : 'XL'}
                </button>
              ))}
            </div>
          </section>

          {/* Contrast */}
          <section role="group" aria-labelledby="contrast-heading">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Moon className="h-5 w-5" />
              <h3 id="contrast-heading" className="text-lg font-semibold">Contraste</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setContrastMode('standard')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  contrastMode === 'standard' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}
                aria-pressed={contrastMode === 'standard'}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                    {contrastMode === 'standard' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <span className="font-medium">Estándar Oscuro</span>
                </div>
              </button>

              <button
                onClick={() => setContrastMode('high-black')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all bg-black text-white ${
                  contrastMode === 'high-black' ? 'border-yellow-400' : 'border-neutral-800'
                }`}
                aria-pressed={contrastMode === 'high-black'}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center font-bold text-[10px]">
                    HC
                  </div>
                  <span className="font-medium">Alto Contraste (Negro)</span>
                </div>
              </button>

              <button
                onClick={() => setContrastMode('high-white')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all bg-white text-black ${
                  contrastMode === 'high-white' ? 'border-blue-800' : 'border-neutral-300'
                }`}
                aria-pressed={contrastMode === 'high-white'}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center font-bold text-[10px]">
                    HC
                  </div>
                  <span className="font-medium">Alto Contraste (Blanco)</span>
                </div>
              </button>
            </div>
          </section>

          {/* Media Preferences */}
          <section role="group" aria-labelledby="media-heading">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Type className="h-5 w-5" />
              <h3 id="media-heading" className="text-lg font-semibold">Preferencias Multimedia</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-card p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Subtitles className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="subtitles-toggle" className="text-base font-medium">Activar Subtítulos</Label>
                    <p className="text-sm text-muted-foreground">Mostrar textos en vídeos por defecto</p>
                  </div>
                </div>
                <Switch 
                  id="subtitles-toggle" 
                  checked={enableSubtitles}
                  onCheckedChange={setEnableSubtitles}
                />
              </div>

              <div className="flex items-center justify-between bg-card p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="easyread-toggle" className="text-base font-medium">Lectura Fácil</Label>
                    <p className="text-sm text-muted-foreground">Versiones simplificadas de texto</p>
                  </div>
                </div>
                <Switch 
                  id="easyread-toggle" 
                  checked={preferEasyRead}
                  onCheckedChange={setPreferEasyRead}
                />
              </div>
            </div>
          </section>

          {/* Live Preview */}
          <div className="p-4 rounded-xl bg-card border border-border border-dashed">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Vista Previa</p>
            <p className="font-medium">"Este antiguo emplazamiento fue establecido en el siglo XII como un punto clave..."</p>
          </div>
        </div>

        <div className="mt-auto pt-4 pb-8 sm:pb-0">
          <Button className="w-full h-12 text-lg font-bold" onClick={onClose}>
            Aplicar Preferencias
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
