export function Footer() {
  return (
    <footer className="w-full border-t bg-gray-100 mt-auto">
      <div className="w-full flex items-center justify-center py-6 px-4">
        <img
          src="/logos/logos-paudit.webp"
          alt="Financiado por"
          className="block mx-auto h-24 md:h-32 max-w-full w-auto object-contain"
          width="1335" /* <-- AÑADIR: Proporción de la imagen */
          height="246" /* <-- AÑADIR: Proporción de la imagen */
          loading="lazy" /* <-- AÑADIR: No bloquear la carga inicial por el footer */
        />
      </div>
    </footer>
  );
}
