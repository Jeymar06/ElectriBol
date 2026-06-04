export const dynamic = 'force-dynamic';

import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { ensureUploadsDir } from '@/lib/storage';
import { isSupabaseEnabled, getBaseUrl } from '@/lib/env';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll('files').filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: 'No se recibieron archivos' }, { status: 400 });
  }

  await ensureUploadsDir();

  const savedFiles: string[] = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Cada archivo debe pesar maximo 5MB' }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Solo se permiten JPG, PNG y WebP' }, { status: 400 });
    }

    const extension = path.extname(file.name) || '.jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
    const bytes = await file.arrayBuffer();

    if (isSupabaseEnabled()) {
      const supabase = createSupabaseAdminClient();
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
      const storagePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, Buffer.from(bytes), {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return NextResponse.json({ error: 'No fue posible subir la imagen a Supabase Storage' }, { status: 500 });
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      savedFiles.push(data.publicUrl);
      continue;
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await fs.writeFile(filePath, Buffer.from(bytes));
    savedFiles.push(`${getBaseUrl()}/uploads/${fileName}`);
  }

  return NextResponse.json({ files: savedFiles });
}
