import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import TrackableExternalLink from '@/components/TrackableExternalLink';
import { buildMetadata } from '@/utils/seo';
import { buildGeneralWhatsAppUrl } from '@/lib/site';
import { getSiteContent } from '@/lib/site-content';

export async function generateMetadata() {
  const content = await getSiteContent();

  return buildMetadata({
    title: content.seo.contactTitle,
    description: content.seo.contactDescription,
    image: content.seo.ogImageUrl,
    siteName: content.seo.siteTitle,
    path: '/contacto',
  });
}

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <div className="section-space">
      <div className="shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div>
            <p className="eyebrow">{content.contactPage.eyebrow}</p>
            <h1 className="mt-3 font-heading text-5xl uppercase tracking-[-0.06em] text-eb-900">
              {content.contactPage.title}
            </h1>
          </div>

          <p className="max-w-2xl text-base leading-7 text-eb-700">
            {content.contactPage.description}
          </p>

          <div className="space-y-4 text-sm text-eb-800">
            <div className="surface flex items-start gap-4 p-5">
              <MapPin className="mt-1 h-5 w-5 text-eb-accent" />
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">
                  {content.contactPage.addressLabel}
                </p>
                <p className="mt-2 leading-6 text-eb-700">{content.contact.address}</p>
              </div>
            </div>

            <div className="surface flex items-start gap-4 p-5">
              <Phone className="mt-1 h-5 w-5 text-eb-accent" />
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">
                  {content.contactPage.phoneLabel}
                </p>
                <a href={`tel:${content.contact.whatsappNumber}`} className="mt-2 block text-eb-700">
                  {content.contact.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className="surface flex items-start gap-4 p-5">
              <Mail className="mt-1 h-5 w-5 text-eb-accent" />
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.14em] text-eb-900">
                  {content.contactPage.emailLabel}
                </p>
                <a href={`mailto:${content.contact.email}`} className="mt-2 block text-eb-700">
                  {content.contact.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="surface flex flex-col gap-6 p-6 md:p-8">
          <div>
            <p className="eyebrow">{content.contactPage.panelEyebrow}</p>
            <h2 className="mt-3 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
              {content.contactPage.panelTitle}
            </h2>
          </div>
          <p className="text-base leading-7 text-eb-700">
            {content.contactPage.hoursPrefix} {content.contact.hours}. {content.contactPage.panelText}
          </p>
          <TrackableExternalLink
            href={buildGeneralWhatsAppUrl(content.contact.whatsappNumber)}
            target="_blank"
            rel="noreferrer"
            tracking={{ event: 'contact_whatsapp_click', label: 'contact_page' }}
            className="btn-primary w-full sm:w-auto"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {content.contactPage.whatsappCta}
          </TrackableExternalLink>
          <iframe
            title={`${content.contactPage.mapTitle} ${content.brand.name}`}
            className="min-h-[320px] w-full rounded-2xl border border-eb-300/10"
            loading="lazy"
            src={content.contact.googleMapsEmbedUrl}
          />
        </section>
      </div>
    </div>
  );
}
