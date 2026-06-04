import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Category, CategoryPayload, Product, ProductPayload } from '@/types';
import { generateSlug } from '@/utils/format';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getAdminProfile } from '@/lib/auth';
import { isSupabaseEnabled } from '@/lib/env';

const dataDir = path.join(process.cwd(), 'data');
const productsFile = path.join(dataDir, 'products.json');
const categoriesFile = path.join(dataDir, 'categories.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

type SupabaseCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type SupabaseProductRow = {
  id: string;
  slug: string;
  name: string;
  reference: string;
  category_id: string;
  price: number | null;
  compare_at_price: number | null;
  price_on_request: boolean;
  unit: string;
  short_description: string;
  description: string;
  available: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  product_images?: Array<{
    public_url: string;
    sort_order: number;
  }>;
};

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'PGRST205'
  );
}

function mapCategoryRow(row: SupabaseCategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductRow(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    reference: row.reference,
    categoryId: row.category_id,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    priceOnRequest: row.price_on_request,
    unit: row.unit,
    shortDescription: row.short_description,
    description: row.description,
    images: (row.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.public_url),
    available: row.available,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function writeAuditLog(action: string, entityType: string, entityId: string, payload?: unknown) {
  if (!isSupabaseEnabled()) {
    return;
  }

  const admin = await getAdminProfile();
  const supabase = createSupabaseAdminClient();
  await supabase.from('audit_logs').insert({
    actor_id: admin?.id || null,
    action,
    entity_type: entityType,
    entity_id: entityId,
    payload: payload ?? null,
  });
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file) as T;
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function revalidateCatalog() {
  revalidatePath('/');
  revalidatePath('/catalogo');
  revalidatePath('/admin');
  revalidatePath('/admin/productos');
  revalidatePath('/admin/categorias');
}

export async function ensureUploadsDir(): Promise<void> {
  await fs.mkdir(uploadsDir, { recursive: true });
}

export async function readProducts(): Promise<Product[]> {
  if (!isSupabaseEnabled()) {
    return readJsonFile<Product[]>(productsFile);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, slug, name, reference, category_id, price, compare_at_price, price_on_request, unit, short_description, description, available, featured, created_at, updated_at, product_images(public_url, sort_order)'
    )
    .order('created_at', { ascending: false });

  if (error) {
    if (isMissingTableError(error)) {
      return readJsonFile<Product[]>(productsFile);
    }
    throw error;
  }

  return (data as SupabaseProductRow[]).map(mapProductRow);
}

export async function writeProducts(products: Product[]): Promise<void> {
  await writeJsonFile(productsFile, products);
  revalidateCatalog();
}

export async function readCategories(): Promise<Category[]> {
  if (!isSupabaseEnabled()) {
    return readJsonFile<Category[]>(categoriesFile);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, icon, active, created_at, updated_at')
    .order('name');

  if (error) {
    if (isMissingTableError(error)) {
      return readJsonFile<Category[]>(categoriesFile);
    }
    throw error;
  }

  return (data as SupabaseCategoryRow[]).map(mapCategoryRow);
}

export async function writeCategories(categories: Category[]): Promise<void> {
  await writeJsonFile(categoriesFile, categories);
  revalidateCatalog();
}

async function syncProductImages(productId: string, images: string[]) {
  const supabase = createSupabaseAdminClient();
  await supabase.from('product_images').delete().eq('product_id', productId);

  if (images.length === 0) {
    return;
  }

  const rows = images.map((image, index) => ({
    product_id: productId,
    storage_path: image,
    public_url: image,
    sort_order: index,
  }));

  const { error } = await supabase.from('product_images').insert(rows);
  if (error) {
    throw error;
  }
}

export async function saveProduct(payload: ProductPayload): Promise<Product> {
  const now = new Date().toISOString();

  if (!isSupabaseEnabled()) {
    const products = await readJsonFile<Product[]>(productsFile);

    if (payload.id) {
      const existingIndex = products.findIndex((product) => product.id === payload.id);
      if (existingIndex === -1) {
        throw new Error('Producto no encontrado');
      }

      const updated: Product = {
        ...products[existingIndex],
        ...payload,
        slug: generateSlug(payload.name),
        updatedAt: now,
      };

      products[existingIndex] = updated;
      await writeProducts(products);
      revalidatePath(`/producto/${updated.slug}`);
      return updated;
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      slug: generateSlug(payload.name),
      name: payload.name,
      reference: payload.reference,
      categoryId: payload.categoryId,
      price: payload.price,
      compareAtPrice: payload.compareAtPrice,
      priceOnRequest: payload.priceOnRequest,
      unit: payload.unit,
      shortDescription: payload.shortDescription,
      description: payload.description,
      images: payload.images,
      available: payload.available,
      featured: payload.featured,
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(created);
    await writeProducts(products);
    revalidatePath(`/producto/${created.slug}`);
    return created;
  }

  const supabase = createSupabaseAdminClient();
  const basePayload = {
    slug: generateSlug(payload.name),
    name: payload.name,
    reference: payload.reference,
    category_id: payload.categoryId,
    price: payload.price,
    compare_at_price: payload.compareAtPrice,
    price_on_request: payload.priceOnRequest,
    unit: payload.unit,
    short_description: payload.shortDescription,
    description: payload.description,
    available: payload.available,
    featured: payload.featured,
    updated_at: now,
  };

  if (payload.id) {
    const { data, error } = await supabase
      .from('products')
      .update(basePayload)
      .eq('id', payload.id)
      .select(
        'id, slug, name, reference, category_id, price, compare_at_price, price_on_request, unit, short_description, description, available, featured, created_at, updated_at'
      )
      .single();

    if (error || !data) {
      throw error || new Error('Producto no encontrado');
    }

    await syncProductImages(data.id, payload.images);
    await writeAuditLog('update', 'product', data.id, payload);
    revalidateCatalog();
    revalidatePath(`/producto/${data.slug}`);
    return mapProductRow({ ...(data as SupabaseProductRow), product_images: payload.images.map((image, index) => ({ public_url: image, sort_order: index })) });
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...basePayload,
      created_at: now,
    })
    .select(
      'id, slug, name, reference, category_id, price, compare_at_price, price_on_request, unit, short_description, description, available, featured, created_at, updated_at'
    )
    .single();

  if (error || !data) {
    throw error || new Error('No fue posible crear el producto');
  }

  await syncProductImages(data.id, payload.images);
  await writeAuditLog('create', 'product', data.id, payload);
  revalidateCatalog();
  revalidatePath(`/producto/${data.slug}`);
  return mapProductRow({ ...(data as SupabaseProductRow), product_images: payload.images.map((image, index) => ({ public_url: image, sort_order: index })) });
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!isSupabaseEnabled()) {
    const products = await readJsonFile<Product[]>(productsFile);
    const product = products.find((item) => item.id === productId);
    const nextProducts = products.filter((item) => item.id !== productId);
    await writeProducts(nextProducts);

    if (product) {
      revalidatePath(`/producto/${product.slug}`);
    }
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('products').select('slug').eq('id', productId).single();
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) {
    throw error;
  }

  await writeAuditLog('delete', 'product', productId);
  revalidateCatalog();
  if (data?.slug) {
    revalidatePath(`/producto/${data.slug}`);
  }
}

export async function toggleProductField(
  productId: string,
  field: 'available' | 'featured',
  value: boolean
): Promise<Product> {
  if (!isSupabaseEnabled()) {
    const products = await readJsonFile<Product[]>(productsFile);
    const index = products.findIndex((item) => item.id === productId);

    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    const updated: Product = {
      ...products[index],
      [field]: value,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updated;
    await writeProducts(products);
    revalidatePath(`/producto/${updated.slug}`);
    return updated;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('products')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .select(
      'id, slug, name, reference, category_id, price, compare_at_price, price_on_request, unit, short_description, description, available, featured, created_at, updated_at, product_images(public_url, sort_order)'
    )
    .single();

  if (error || !data) {
    throw error || new Error('Producto no encontrado');
  }

  await writeAuditLog('toggle', 'product', productId, { field, value });
  revalidateCatalog();
  revalidatePath(`/producto/${data.slug}`);
  return mapProductRow(data as SupabaseProductRow);
}

export async function saveCategory(payload: CategoryPayload): Promise<Category> {
  if (!isSupabaseEnabled()) {
    const categories = await readJsonFile<Category[]>(categoriesFile);

    if (payload.id) {
      const existingIndex = categories.findIndex((category) => category.id === payload.id);
      if (existingIndex === -1) {
        throw new Error('Categoria no encontrada');
      }

      const updated: Category = {
        ...categories[existingIndex],
        ...payload,
        slug: generateSlug(payload.name),
        id: payload.id,
      };

      categories[existingIndex] = updated;
      await writeCategories(categories);
      return updated;
    }

    const slug = generateSlug(payload.name);
    const created: Category = {
      id: slug,
      slug,
      name: payload.name,
      description: payload.description,
      icon: payload.icon,
      active: payload.active,
    };

    categories.push(created);
    await writeCategories(categories);
    return created;
  }

  const supabase = createSupabaseAdminClient();
  const basePayload = {
    name: payload.name,
    slug: generateSlug(payload.name),
    description: payload.description,
    icon: payload.icon,
    active: payload.active,
    updated_at: new Date().toISOString(),
  };

  if (payload.id) {
    const { data, error } = await supabase
      .from('categories')
      .update(basePayload)
      .eq('id', payload.id)
      .select('id, name, slug, description, icon, active, created_at, updated_at')
      .single();

    if (error || !data) {
      throw error || new Error('Categoria no encontrada');
    }

    await writeAuditLog('update', 'category', data.id, payload);
    revalidateCatalog();
    return mapCategoryRow(data as SupabaseCategoryRow);
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...basePayload, created_at: new Date().toISOString() })
    .select('id, name, slug, description, icon, active, created_at, updated_at')
    .single();

  if (error || !data) {
    throw error || new Error('No fue posible crear la categoria');
  }

  await writeAuditLog('create', 'category', data.id, payload);
  revalidateCatalog();
  return mapCategoryRow(data as SupabaseCategoryRow);
}

export async function toggleCategoryActive(categoryId: string, active: boolean): Promise<Category> {
  if (!isSupabaseEnabled()) {
    const categories = await readJsonFile<Category[]>(categoriesFile);
    const index = categories.findIndex((item) => item.id === categoryId);

    if (index === -1) {
      throw new Error('Categoria no encontrada');
    }

    const updated = { ...categories[index], active };
    categories[index] = updated;
    await writeCategories(categories);
    return updated;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', categoryId)
    .select('id, name, slug, description, icon, active, created_at, updated_at')
    .single();

  if (error || !data) {
    throw error || new Error('Categoria no encontrada');
  }

  await writeAuditLog('toggle', 'category', categoryId, { active });
  revalidateCatalog();
  return mapCategoryRow(data as SupabaseCategoryRow);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  if (!isSupabaseEnabled()) {
    const [categories, products] = await Promise.all([
      readJsonFile<Category[]>(categoriesFile),
      readJsonFile<Product[]>(productsFile),
    ]);
    const linkedProducts = products.some((product) => product.categoryId === categoryId);

    if (linkedProducts) {
      throw new Error('No puedes eliminar una categoria con productos asociados');
    }

    const nextCategories = categories.filter((category) => category.id !== categoryId);
    await writeCategories(nextCategories);
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { count } = await supabase
    .from('products')
    .select('id', { head: true, count: 'exact' })
    .eq('category_id', categoryId);

  if ((count || 0) > 0) {
    throw new Error('No puedes eliminar una categoria con productos asociados');
  }

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);
  if (error) {
    throw error;
  }

  await writeAuditLog('delete', 'category', categoryId);
  revalidateCatalog();
}
