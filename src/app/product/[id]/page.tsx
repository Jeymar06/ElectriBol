import { redirect } from 'next/navigation';
import { getProductById } from '@/lib/catalog';

export default async function LegacyProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    redirect('/catalogo');
  }

  redirect(`/producto/${product.slug}`);
}
