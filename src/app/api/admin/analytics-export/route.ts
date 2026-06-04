export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAnalyticsExportRows } from '@/lib/analytics';
import { isAdminAuthenticated } from '@/lib/auth';
import { consumeRateLimit, getClientIp, RateLimitError } from '@/lib/security';

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    consumeRateLimit('analytics-export', getClientIp(request), {
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });

    const rows = await getAnalyticsExportRows();
    const header = [
      'created_at',
      'event',
      'path',
      'label',
      'product_name',
      'category',
      'query',
      'ip',
      'user_agent',
    ];
    const csv = [
      header.join(','),
      ...rows.map((row) =>
        [
          row.createdAt,
          row.event,
          row.path,
          row.label,
          row.productName,
          row.category,
          row.query,
          row.ip,
          row.userAgent,
        ]
          .map((value) => escapeCsvCell(String(value)))
          .join(',')
      ),
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="electribol-analytics-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'No fue posible exportar las metricas' }, { status: 500 });
  }
}
