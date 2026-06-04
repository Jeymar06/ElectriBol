export const siteConfig = {
  name: 'ElectriBol',
  tagline: 'Muestrario digital de ferreteria electrica en Cantagallo, Bolivar',
  description:
    'Lamparas LED, cables electricos, reflectores y accesorios para hogares, comercios y proyectos electricos.',
  city: 'Cantagallo, Bolivar',
  address: 'Carrera 3 #11-30, Barrio 23 de enero, Cantagallo, Bolivar',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573015956954',
  whatsappDisplay: '+57 301 595 6954',
  email: 'info@electribol.com',
  hours: 'Lunes-Viernes 8AM-6PM | Sabados 8AM-2PM | Domingos: Cerrado',
  announcement:
    'Atendemos en Cantagallo, Bolivar. Lunes a viernes de 8AM a 6PM y sabados hasta las 2PM.',
};

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppUrl(name: string, reference: string): string {
  return createWhatsAppUrl(
    `Hola, me interesa *${name}* (Ref: ${reference}). ¿Me pueden dar mas informacion?`
  );
}
