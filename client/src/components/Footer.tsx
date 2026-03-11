
export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <img
            src="/logos/ES_co_fundedvertical_RGB_NEG.png"
            alt="Financiado por la Unión Europea"
            className="h-20 md:h-20 w-auto object-contain"
          />
          <img
            src="/logos/MEFPD.Gob.Web-72px.png"
            alt="Ministerio de Educación, Formación Profesional y Deportes"
            className="h-14 md:h-18 w-auto object-contain"
          />
          <img
            src="/logos/Junta-de-Extremadura-Consejeria-Educacion-Ciencia-y-Formacion-Profesional.png"
            alt="Junta de Extremadura - Consejería de Educación, Ciencia y Formación Profesional"
            className="h-8 md:h-16 w-auto object-contain"
          />
          <img
            src="/logos/Logotipo_de_los_Fondos_Europeos.svg.png"
            alt="Logotipo de los Fondos Europeos"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
