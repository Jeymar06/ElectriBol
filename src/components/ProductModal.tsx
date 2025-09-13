'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Star, ShoppingCart, MessageCircle, Tag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, generateWhatsAppUrl } from '@/lib/products';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToQuote?: (product: Product) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToQuote,
}: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setCurrentImageIndex(0);
      setImageError(false);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToQuote = () => {
    if (onAddToQuote) {
      onAddToQuote(product);
    }
  };

  const handleWhatsApp = () => {
    window.open(generateWhatsAppUrl(product), '_blank');
  };

  const isOnSale = product.price < 100000;
  const isLowStock = product.stock < 5;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        data-testid="product-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 && !imageError ? (
                  <>
                    <Image
                      src={product.images[currentImageIndex]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                    
                    {/* Navegación de imágenes */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                          aria-label="Imagen siguiente"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-electribol-blue to-electribol-yellow">
                    <span className="text-white font-bold text-4xl">
                      {product.title.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Etiquetas */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {isOnSale && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      OFERTA
                    </span>
                  )}
                  {product.popular && (
                    <span className="bg-electribol-yellow text-text-dark text-sm font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  )}
                  {isLowStock && (
                    <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      POCAS UNIDADES
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'border-electribol-blue'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              {/* Categoría y SKU */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>{product.category}</span>
                </div>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating}) • {product.stock} en stock
                </span>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-electribol-blue">
                    {formatPrice(product.price)}
                  </span>
                  {isOnSale && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price * 1.3)}
                    </span>
                  )}
                </div>
                {isOnSale && (
                  <p className="text-sm text-green-600 font-medium">
                    ¡Ahorra {formatPrice(product.price * 0.3)}!
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Características
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensiones */}
              {product.dimensions && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dimensiones
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Ancho</p>
                      <p className="text-gray-600">{product.dimensions.width}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Alto</p>
                      <p className="text-gray-600">{product.dimensions.height}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Profundidad</p>
                      <p className="text-gray-600">{product.dimensions.depth}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="space-y-3">
                {product.stock > 0 ? (
                  <>
                    <button
                      onClick={handleAddToQuote}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Agregar a cotización</span>
                    </button>
                    
                    <button
                      onClick={handleWhatsApp}
                      className="w-full btn-outline flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Consultar por WhatsApp</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleWhatsApp}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Consultar disponibilidad</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
