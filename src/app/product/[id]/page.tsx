import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, ShoppingCart, MessageCircle, Tag, Share2 } from 'lucide-react';
import { getProductById, formatPrice, generateWhatsAppUrl } from '@/lib/products';
import { Product } from '@/types';
import { generateSEOMeta } from '@/utils/seo';
import ProductClient from './ProductClient';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/"
            className="btn-primary"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return <ProductClient product={product} />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  
  if (!product) {
    return {
      title: 'Producto no encontrado | ElectriBol',
      description: 'El producto que buscas no existe o ha sido eliminado.',
    };
  }

  return generateSEOMeta({
    title: product.title,
    description: product.shortDescription,
    image: product.images[0],
    url: `/product/${product.id}`,
    product,
  });
}