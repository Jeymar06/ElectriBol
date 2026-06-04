require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
const productsPath = path.join(process.cwd(), 'data', 'products.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function syncCategories() {
  const categories = readJson(categoriesPath);

  const rows = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    active: category.active,
    created_at: category.createdAt || new Date().toISOString(),
    updated_at: category.updatedAt || new Date().toISOString(),
  }));

  const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'slug' });
  if (error) {
    throw error;
  }
}

async function syncProducts() {
  const products = readJson(productsPath);
  const categories = await supabase.from('categories').select('id, slug');

  if (categories.error) {
    throw categories.error;
  }

  const categoryMap = new Map(categories.data.map((category) => [category.slug, category.id]));

  const productRows = products.map((product) => ({
    category_id: categoryMap.get(product.categoryId),
    name: product.name,
    slug: product.slug,
    reference: product.reference,
    price: product.price,
    compare_at_price: product.compareAtPrice,
    price_on_request: product.priceOnRequest,
    unit: product.unit,
    short_description: product.shortDescription,
    description: product.description,
    available: product.available,
    featured: product.featured,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  }));

  const invalidProduct = productRows.find((product) => !product.category_id);
  if (invalidProduct) {
    throw new Error(`No se encontro category_id para el producto ${invalidProduct.slug}`);
  }

  const { error } = await supabase.from('products').upsert(productRows, { onConflict: 'slug' });
  if (error) {
    throw error;
  }

  const savedProducts = await supabase.from('products').select('id, slug');
  if (savedProducts.error) {
    throw savedProducts.error;
  }

  const productMap = new Map(savedProducts.data.map((product) => [product.slug, product.id]));

  const { error: deleteImagesError } = await supabase
    .from('product_images')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteImagesError) {
    throw deleteImagesError;
  }

  const imageRows = products.flatMap((product) =>
    (product.images || []).map((image, index) => ({
      product_id: productMap.get(product.slug),
      storage_path: image,
      public_url: image,
      sort_order: index,
    }))
  );

  if (imageRows.length > 0) {
    const { error: insertImagesError } = await supabase.from('product_images').insert(imageRows);
    if (insertImagesError) {
      throw insertImagesError;
    }
  }
}

async function ensureAdminProfile() {
  const email = process.env.SUPABASE_ADMIN_EMAIL;
  if (!email) {
    return;
  }

  const users = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const adminUser = users.data.users.find((user) => user.email === email);

  if (!adminUser) {
    console.warn(`No se encontro el usuario admin ${email} en Supabase Auth.`);
    return;
  }

  const { error } = await supabase.from('profiles').upsert({
    id: adminUser.id,
    email,
    role: 'admin',
    full_name: 'ElectriBol Admin',
  });

  if (error) {
    throw error;
  }
}

async function main() {
  await syncCategories();
  await syncProducts();
  await ensureAdminProfile();
  console.log('Supabase sincronizado correctamente.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
