'use client';

import { useState } from 'react';
import { MapPinned, Navigation, Phone, Route } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export default function LocationExperience() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDirections = () => {
    if (!navigator.geolocation) {
      window.open(siteConfig.googleMapsUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = encodeURIComponent(siteConfig.googleMapsQuery);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setLoading(false);
      },
      () => {
        setError('No pudimos tomar tu ubicacion. Abrimos el mapa general del local.');
        window.open(siteConfig.googleMapsUrl, '_blank', 'noopener,noreferrer');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="section-space pt-16">
      <div className="shell">
        <div className="location-shell">
          <div className="space-y-5">
            <p className="eyebrow">Ubicacion y ruta</p>
            <h2 className="display-title text-4xl sm:text-5xl">
              Un punto fisico claro para visitas, retiros y consultas locales.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-eb-700">
              Integramos una experiencia de mapa mas util para negocio local: ubicacion visual,
              acceso directo a Google Maps y boton para calcular la ruta desde el telefono del
              cliente.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-slab p-5">
                <MapPinned className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-xl uppercase tracking-[-0.04em] text-eb-900">
                  Direccion
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">{siteConfig.address}</p>
              </div>
              <div className="glass-slab p-5">
                <Phone className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-xl uppercase tracking-[-0.04em] text-eb-900">
                  Atencion
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">{siteConfig.hours}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <Route className="mr-2 h-4 w-4" />
                Abrir en Google Maps
              </a>
              <button type="button" onClick={handleDirections} className="btn-secondary">
                <Navigation className="mr-2 h-4 w-4" />
                {loading ? 'Buscando ruta...' : 'Calcular ruta desde mi ubicacion'}
              </button>
            </div>

            {error ? <p className="text-sm text-eb-700">{error}</p> : null}
          </div>

          <div className="map-frame">
            <iframe
              title="Mapa del local ElectriBol"
              src={siteConfig.googleMapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[420px] w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
