import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { buildMetadata } from '@/utils/seo';
import { siteConfig } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Contacto',
  description: 'Contacta a ElectriBol por WhatsApp, telefono o correo.',
  path: '/contacto',
});

export default function ContactPage() {
  return (
    <div className="section-space">
      <div className="shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div>
            <p className="eyebrow">Contacto</p>
            <h1 className="mt-3 font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
              Estamos listos para ayudarte con tu pedido.
            </h1>
          </div>

          <p className="max-w-2xl text-base leading-7 text-eb-700">
            Si ya viste una referencia en el catalogo, escribenos por WhatsApp. Si todavia estas
            definiendo materiales, tambien podemos orientarte.
          </p>

          <div className="space-y-4 text-sm text-eb-800">
            <div className="surface flex items-start gap-4 p-5">
              <MapPin className="mt-1 h-5 w-5 text-eb-accent" />
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">Direccion</p>
                <p className="mt-2 leading-6 text-eb-700">{siteConfig.address}</p>
              </div>
            </div>

            <div className="surface flex items-start gap-4 p-5">
              <Phone className="mt-1 h-5 w-5 text-eb-accent" />
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">Telefono</p>
                <a href={`tel:${siteConfig.whatsappNumber}`} className="mt-2 block text-eb-700">
                  {siteConfig.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className="surface flex items-start gap-4 p-5">
              <Mail className="mt-1 h-5 w-5 text-eb-accent" />
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">Correo</p>
                <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-eb-700">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="surface flex flex-col gap-6 p-6 md:p-8">
          <div>
            <p className="eyebrow">Canal recomendado</p>
            <h2 className="mt-3 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
              WhatsApp directo para cotizaciones.
            </h2>
          </div>
          <p className="text-base leading-7 text-eb-700">
            Horario de atencion: {siteConfig.hours}. Responde con la referencia o una foto de lo
            que necesitas y te ayudamos a ubicarlo.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Abrir WhatsApp
          </a>
          <iframe
            title="Ubicacion ElectriBol"
            className="min-h-[320px] w-full rounded-2xl border border-eb-300/10"
            loading="lazy"
            src="https://maps.google.com/maps?q=Carrera%203%20%2311-30%2C%20Cantagallo%2C%20Bolivar&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />
        </section>
      </div>
    </div>
  );
}
