import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="section-space">
      <div className="shell">
        <div className="surface mx-auto max-w-2xl space-y-4 p-8 text-center">
          <p className="eyebrow">404</p>
          <h1 className="font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
            Esta pagina no existe
          </h1>
          <p className="text-base leading-7 text-eb-700">
            Puede que la referencia haya cambiado o que la ruta ya no este disponible.
          </p>
          <div className="flex justify-center">
            <Link href="/" className="btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
