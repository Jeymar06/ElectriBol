'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Star, Tag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, generateWhatsAppUrl } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  onAddToQuote?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  showAddToQuote?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  onAddToQuote,
  onViewDetails,
  showAddToQuote = true,
  className = '',
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToQuote) {
      onAddToQuote(product);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(generateWhatsAppUrl(product), '_blank');
  };

  const isOnSale = product.price < 100000;
  const isLowStock = product.stock < 5;

  return (
    <div
      className={`card card-hover group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="product-card"
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {product.images && product.images.length > 0 && !imageError ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-electribol-blue to-electribol-yellow">
            <span className="text-white font-bold text-2xl">
              {product.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Etiquetas */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {isOnSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              OFERTA
            </span>
          )}
          {product.popular && (
            <span className="bg-electribol-yellow text-text-dark text-xs font-bold px-2 py-1 rounded-full">
              POPULAR
            </span>
          )}
          {isLowStock && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              POCAS UNIDADES
            </span>
          )}
        </div>

        {/* Botones de acción */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex space-x-2">
            <button
              onClick={handleViewDetails}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              aria-label="Ver detalles"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            
            {showAddToQuote && (
              <button
                onClick={handleAddToQuote}
                className="p-2 bg-electribol-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                aria-label="Agregar a cotización"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stock indicator */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
              AGOTADO
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        <div className="flex items-center space-x-2 mb-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* SKU */}
        <p className="text-xs text-gray-500 mb-2">
          SKU: {product.sku}
        </p>

        {/* Descripción corta */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.rating})
          </span>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-electribol-blue" data-testid="product-price">
              {formatPrice(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.price * 1.3)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{product.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-2">
          {product.stock > 0 ? (
            <>
              {showAddToQuote && (
                <button
                  onClick={handleAddToQuote}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar a cotización</span>
                </button>
              )}
              
              <button
                onClick={handleWhatsApp}
                className="w-full btn-outline text-sm"
              >
                Consultar por WhatsApp
              </button>
            </>
          ) : (
            <button
              onClick={handleWhatsApp}
              className="w-full btn-secondary"
            >
              Consultar disponibilidad
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
