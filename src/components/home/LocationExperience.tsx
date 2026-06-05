'use client';

import { useState } from 'react';
import { MapPinned, Navigation, Phone, Route } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { sendTrackingEvent } from '@/lib/tracking';
import type { SiteContent } from '@/types';

export default function LocationExperience({ content }: { content?: SiteContent }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contact = content?.contact || siteConfig;
  const section = content?.locationSection;

  const handleDirections = () => {
    if (!navigator.geolocation) {
      window.open(contact.googleMapsUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendTrackingEvent({ event: 'directions_click', label: 'location_section' });
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = encodeURIComponent(contact.googleMapsQuery);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setLoading(false);
      },
      () => {
        setError(section?.errorText || 'No pudimos tomar tu ubicacion. Abrimos el mapa general del local.');
        window.open(contact.googleMapsUrl, '_blank', 'noopener,noreferrer');
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
            <p className="eyebrow">{section?.eyebrow || 'Ubicacion y ruta'}</p>
            <h2 className="display-title text-4xl sm:text-5xl">
              {section?.title || 'Encuentranos facil y llega directo al local.'}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-eb-700">
              {section?.description ||
                'Consulta la ubicacion, abre el recorrido en Google Maps o calcula la ruta desde tu celular para visitarnos con mas facilidad.'}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-slab p-5">
                <MapPinned className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-xl uppercase tracking-[-0.04em] text-eb-900">
                  {section?.addressLabel || 'Direccion'}
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">{contact.address}</p>
              </div>
              <div className="glass-slab p-5">
                <Phone className="h-6 w-6 text-eb-accent" />
                <p className="mt-4 font-heading text-xl uppercase tracking-[-0.04em] text-eb-900">
                  {section?.hoursLabel || 'Horario'}
                </p>
                <p className="mt-3 text-sm leading-7 text-eb-700">{contact.hours}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sendTrackingEvent({ event: 'map_open', label: 'location_section' })}
                className="btn-primary"
              >
                <Route className="mr-2 h-4 w-4" />
                {section?.mapCta || 'Abrir en Google Maps'}
              </a>
              <button type="button" onClick={handleDirections} className="btn-secondary">
                <Navigation className="mr-2 h-4 w-4" />
                {loading
                  ? section?.directionsLoading || 'Buscando ruta...'
                  : section?.directionsCta || 'Calcular ruta desde mi ubicacion'}
              </button>
            </div>

            {error ? <p className="text-sm text-eb-700">{error}</p> : null}
          </div>

          <div className="map-frame">
            <iframe
              title={`${section?.mapTitle || 'Mapa del local'} ${content?.brand.name || 'ElectriBol'}`}
              src={contact.googleMapsEmbedUrl}
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
