import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Obliga al navegador a subir arriba del todo inmediatamente
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Puedes cambiarlo a "smooth" si quieres que suba con animación suave
    });
  }, [location]); // Este código se ejecuta cada vez que 'location' (la URL) cambia

  return null; // Este componente no renderiza nada visual
}
