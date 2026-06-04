import { siteConfig } from '@/lib/site';

export default function AnnouncementBar() {
  const message = `${siteConfig.city} | ${siteConfig.hours} | WhatsApp ${siteConfig.whatsappDisplay}`;

  return (
    <div className="border-b border-eb-500/10 bg-eb-900 text-xs text-white">
      <div className="overflow-hidden whitespace-nowrap py-2">
        <div className="marquee-track gap-10 px-4 font-heading uppercase tracking-[0.18em] text-eb-100/90">
          <span>{message}</span>
          <span>{message}</span>
          <span>{message}</span>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
