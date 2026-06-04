export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getCategories } from '@/lib/catalog';
import { saveCategory } from '@/lib/storage';
import type { CategoryPayload } from '@/types';

export async function GET() {
  const categories = await getCategories(false);
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const payload = (await request.json()) as CategoryPayload;
  const category = await saveCategory(payload);
  return NextResponse.json(category, { status: 201 });
}
