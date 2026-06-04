import { NextResponse } from 'next/server';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';
import type { AnalyticsEventName, AnalyticsPayload } from '@/lib/tracking';

const allowedEvents = new Set<AnalyticsEventName>([
  'whatsapp_click',
  'product_whatsapp_click',
  'catalog_whatsapp_click',
  'contact_whatsapp_click',
  'map_open',
  'directions_click',
  'catalog_empty_search',
  'product_view',
]);

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    consumeRateLimit('analytics-event', clientIp, {
      limit: 80,
      windowMs: 5 * 60 * 1000,
    });

    const payload = (await request.json()) as AnalyticsPayload;
    if (!payload.event || !allowedEvents.has(payload.event)) {
      return NextResponse.json({ error: 'Evento invalido' }, { status: 400 });
    }

    await trackAnalyticsEvent({
      ...payload,
      ip: clientIp,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ ok: true }, { status: 202 });
  }
}
