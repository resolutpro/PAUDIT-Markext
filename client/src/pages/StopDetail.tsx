import { useEffect, useState, useRef } from "react";
import { useRoute, Link, useLocation } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Type,
  Maximize,
  Ear,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/context/AccessibilityContext";

interface StopData {
  id: number;
  title: string;
  imageUrl: string;
  imageAlt: string;
  text: string;
  audioUrl: string;
  audioTranscript: string;
  lseVideoUrl: string;
  videoTranscript: string;
}

interface RouteData {
  title: string;
  stops: StopData[];
}

export default function StopDetail() {
  const [, params] = useRoute("/rutas/:slug/:stopId");
  const [, setLocation] = useLocation();
  const slug = params?.slug;
  const stopId = parseInt(params?.stopId || "1");

  const { preferEasyRead, enableSubtitles } = useAccessibility();

  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [stop, setStop] = useState<StopData | null>(null);
  const [totalStops, setTotalStops] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    fetch(`/api/routes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setRouteData({ title: data.title, stops: data.stops });
        setTotalStops(data.stops.length);
        const currentStop = data.stops.find((s: StopData) => s.id === stopId);
        if (currentStop) setStop(currentStop);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stop details:", err);
        setIsLoading(false);
      });
  }, [slug, stopId]);

  // Audio setup
  useEffect(() => {
    if (stop?.audioUrl) {
      // Usar el constructor de Audio con la URL completa
      const audio = new Audio(stop.audioUrl);
      audioRef.current = audio;

      const updateProgress = () => {
        if (audio && audio.duration) {
          setAudioProgress(
            (audio.currentTime / audio.duration) * 100,
          );
        }
      };

      const handleEnded = () => setIsPlaying(false);
      
      const handleError = (e: any) => {
        console.error("Error en la reproducción de audio:", e);
        setIsPlaying(false);
      };

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [stop?.audioUrl]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error al reproducir audio:", err);
      setIsPlaying(false);
    }
  };

  const skipAudio = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pt-20 text-center">
        Cargando contenido...
      </div>
    );
  }

  if (!stop) {
    return (
      <div className="min-h-screen bg-background p-4 pt-20 text-center">
        Parada no encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border/50 px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation(`/rutas/${slug}`)}
          aria-label="Volver al detalle de la ruta"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-base font-bold text-center truncate px-2">
          Parada {stopId}: {stop.title}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ajustar tamaño de texto"
        >
          <Type className="h-5 w-5" />
        </Button>
      </header>

      <main
        id="main-content"
        className="flex-1 container max-w-2xl mx-auto p-4 md:py-8 space-y-8"
      >
        {/* Header Section */}
        <section aria-labelledby="stop-title">
          <h2 id="stop-title" className="text-3xl md:text-4xl font-bold mb-2">
            {stop.title}
          </h2>
          <p className="text-sm text-primary font-medium mb-6">
            PAUDIT v1.0 • Guía Multimedia
          </p>

          <div className="flex bg-secondary p-1 rounded-lg mb-6 max-w-sm">
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-md ${!preferEasyRead ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Estándar
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-md ${preferEasyRead ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Lectura Fácil
            </button>
          </div>

          <p className="text-lg leading-relaxed">{stop.text}</p>
        </section>

        {/* Audio Guide Section */}
        <section
          aria-labelledby="audio-heading"
          className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
        >
          <h3 id="audio-heading" className="text-xl font-bold mb-4">
            Audioguía
          </h3>

          <div className="bg-secondary/50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                  <Ear className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Narración en Español</p>
                  <p className="text-xs text-muted-foreground">
                    Duración: 2:30
                  </p>
                </div>
              </div>
              <span className="bg-background px-2 py-1 rounded text-xs font-bold border border-border">
                1.0x
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-border rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${audioProgress}%` }}
              ></div>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipAudio(-10)}
                aria-label="Retroceder 10 segundos"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg"
                onClick={toggleAudio}
                aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipAudio(10)}
                aria-label="Avanzar 10 segundos"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={() => setShowTranscript(!showTranscript)}
            aria-expanded={showTranscript}
            aria-controls="audio-transcript"
          >
            <Type className="h-4 w-4" />
            {showTranscript ? "Ocultar Transcripción" : "Mostrar Transcripción"}
          </Button>

          {showTranscript && (
            <div
              id="audio-transcript"
              className="mt-4 p-4 bg-muted rounded-xl text-base border border-border animate-in fade-in slide-in-from-top-4"
            >
              <p className="italic">{stop.audioTranscript}</p>
            </div>
          )}
        </section>

        {/* Sign Language Section */}
        <section
          aria-labelledby="lse-heading"
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-5 pb-0">
            <h3 id="lse-heading" className="text-xl font-bold mb-4">
              Lengua de Signos (LSE)
            </h3>
          </div>

          <div className="relative aspect-video bg-black flex items-center justify-center group">
            {/* Simulated Video Player */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center"></div>

            <Button
              size="icon"
              variant="secondary"
              className="h-16 w-16 rounded-full relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
              aria-label="Reproducir vídeo LSE"
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 rounded-full h-8 w-8 z-10"
              aria-label="Pantalla completa"
            >
              <Maximize className="h-4 w-4" />
            </Button>

            {enableSubtitles && (
              <div className="absolute bottom-4 left-0 w-full text-center z-10 px-4">
                <span className="bg-black/70 text-white text-sm md:text-base px-3 py-1 rounded inline-block backdrop-blur-sm shadow-sm">
                  Subtítulos Activados
                </span>
              </div>
            )}
          </div>

          <div className="p-4 bg-secondary/30">
            <h4 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">
              Descripción del Vídeo
            </h4>
            <p className="text-sm">{stop.videoTranscript}</p>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 w-full bg-background border-t border-border/50 p-4 pb-safe z-40"
        aria-label="Navegación entre paradas"
      >
        <div className="container max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            disabled={stopId <= 1}
            onClick={() => setLocation(`/rutas/${slug}/${stopId - 1}`)}
            aria-label="Parada anterior"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <div className="flex flex-col items-center">
            <span className="font-bold text-primary">
              Parada {stopId} de {totalStops}
            </span>
            <div className="flex gap-1 mt-1" aria-hidden="true">
              {Array.from({ length: totalStops }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${i + 1 === stopId ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            className="gap-2"
            disabled={stopId >= totalStops}
            onClick={() => setLocation(`/rutas/${slug}/${stopId + 1}`)}
            aria-label="Siguiente parada"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
