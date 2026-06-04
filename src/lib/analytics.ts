import 'server-only';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseEnabled } from '@/lib/env';
import type { AnalyticsEventName, AnalyticsPayload } from '@/lib/tracking';

type AnalyticsSummary = {
  totalEvents: number;
  whatsappClicks: number;
  mapInteractions: number;
  emptySearches: number;
  topProducts: Array<{ name: string; count: number }>;
  topCategories: Array<{ name: string; count: number }>;
  productViews: number;
  recentWhatsappClicks: number;
  recentEvents: AnalyticsEventRecord[];
};

export type AnalyticsEventRecord = {
  event: AnalyticsEventName;
  createdAt: string;
  path: string;
  label: string | null;
  productName: string | null;
  category: string | null;
  query: string | null;
};

function emptySummary(): AnalyticsSummary {
  return {
    totalEvents: 0,
    whatsappClicks: 0,
    mapInteractions: 0,
    emptySearches: 0,
    topProducts: [],
    topCategories: [],
    productViews: 0,
    recentWhatsappClicks: 0,
    recentEvents: [],
  };
}

export async function trackAnalyticsEvent(
  payload: AnalyticsPayload & { ip?: string; userAgent?: string }
) {
  if (!isSupabaseEnabled()) {
    return;
  }

  const supabase = createSupabaseAdminClient();
  await supabase.from('audit_logs').insert({
    actor_id: null,
    action: 'track',
    entity_type: 'analytics',
    entity_id: payload.event,
    payload: {
      path: payload.path || '/',
      label: payload.label || null,
      productId: payload.productId || null,
      productName: payload.productName || null,
      category: payload.category || null,
      query: payload.query || null,
      ip: payload.ip || null,
      userAgent: payload.userAgent || null,
    },
  });
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!isSupabaseEnabled()) {
    return emptySummary();
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('entity_id, payload, created_at')
    .eq('action', 'track')
    .eq('entity_type', 'analytics')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error || !data) {
    return emptySummary();
  }

  const rows = data as Array<{
    entity_id: AnalyticsEventName;
    payload?: {
      path?: string | null;
      label?: string | null;
      productName?: string | null;
      category?: string | null;
      query?: string | null;
    };
    created_at: string;
  }>;

  const productCounter = new Map<string, number>();
  const categoryCounter = new Map<string, number>();
  let whatsappClicks = 0;
  let mapInteractions = 0;
  let emptySearches = 0;
  let productViews = 0;
  let recentWhatsappClicks = 0;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const row of rows) {
    const eventTime = new Date(row.created_at).getTime();

    if (
      row.entity_id === 'whatsapp_click' ||
      row.entity_id === 'product_whatsapp_click' ||
      row.entity_id === 'catalog_whatsapp_click' ||
      row.entity_id === 'contact_whatsapp_click'
    ) {
      whatsappClicks += 1;
      if (eventTime >= sevenDaysAgo) {
        recentWhatsappClicks += 1;
      }
    }

    if (row.entity_id === 'map_open' || row.entity_id === 'directions_click') {
      mapInteractions += 1;
    }

    if (row.entity_id === 'catalog_empty_search') {
      emptySearches += 1;
    }

    if (row.entity_id === 'product_view') {
      productViews += 1;
    }

    if (row.payload?.productName) {
      productCounter.set(
        row.payload.productName,
        (productCounter.get(row.payload.productName) || 0) + 1
      );
    }

    if (row.payload?.category) {
      categoryCounter.set(row.payload.category, (categoryCounter.get(row.payload.category) || 0) + 1);
    }
  }

  const topProducts = Array.from(productCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topCategories = Array.from(categoryCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const recentEvents = rows.slice(0, 8).map((row) => ({
    event: row.entity_id,
    createdAt: row.created_at,
    path: row.payload?.path || '/',
    label: row.payload?.label || null,
    productName: row.payload?.productName || null,
    category: row.payload?.category || null,
    query: row.payload?.query || null,
  }));

  return {
    totalEvents: rows.length,
    whatsappClicks,
    mapInteractions,
    emptySearches,
    topProducts,
    topCategories,
    productViews,
    recentWhatsappClicks,
    recentEvents,
  };
}

export async function getAnalyticsExportRows() {
  if (!isSupabaseEnabled()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('entity_id, payload, created_at')
    .eq('action', 'track')
    .eq('entity_type', 'analytics')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error || !data) {
    return [];
  }

  return (data as Array<{
    entity_id: AnalyticsEventName;
    payload?: {
      path?: string | null;
      label?: string | null;
      productName?: string | null;
      category?: string | null;
      query?: string | null;
      ip?: string | null;
      userAgent?: string | null;
    };
    created_at: string;
  }>).map((row) => ({
    createdAt: row.created_at,
    event: row.entity_id,
    path: row.payload?.path || '/',
    label: row.payload?.label || '',
    productName: row.payload?.productName || '',
    category: row.payload?.category || '',
    query: row.payload?.query || '',
    ip: row.payload?.ip || '',
    userAgent: row.payload?.userAgent || '',
  }));
}
