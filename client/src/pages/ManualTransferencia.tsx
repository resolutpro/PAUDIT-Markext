import { Download, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ManualTransferencia() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Manual de transferencia</h1>
        <p className="mt-2 text-muted-foreground">
          Descarga el documento PDF con la información técnica y de desarrollo de la web.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">manual-transferencia.pdf</h2>
            <p className="text-sm text-muted-foreground">Archivo PDF listo para descargar.</p>
          </div>
        </div>

        <Button asChild className="mt-6">
          <a href="/manual-transferencia.pdf" download data-testid="button-descargar-manual">
            <Download className="mr-2 h-4 w-4" />
            Descargar manual
          </a>
        </Button>
      </div>
    </main>
  );
}