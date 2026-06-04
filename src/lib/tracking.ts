export type AnalyticsEventName =
  | 'whatsapp_click'
  | 'product_whatsapp_click'
  | 'catalog_whatsapp_click'
  | 'contact_whatsapp_click'
  | 'map_open'
  | 'directions_click'
  | 'catalog_empty_search'
  | 'product_view';

export type AnalyticsPayload = {
  event: AnalyticsEventName;
  path?: string;
  label?: string;
  productId?: string;
  productName?: string;
  category?: string;
  query?: string;
};

export function sendTrackingEvent(payload: AnalyticsPayload) {
  const body = JSON.stringify({
    ...payload,
    path:
      payload.path ||
      (typeof window !== 'undefined' ? window.location.pathname : undefined),
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/events', blob);
    return;
  }

  void fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
