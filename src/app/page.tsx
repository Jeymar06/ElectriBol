'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChevronRight, Star, Zap, Shield, Truck, Headphones } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import PriceSlider from '@/components/PriceSlider';
import ProductModal from '@/components/ProductModal';
import { getAllProducts, getAllCategories, getPopularProducts, getProductsOnSale } from '@/lib/products';
import { searchProducts } from '@/lib/fuse';
import { Product, SearchFilters } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    priceRange: [0, 1000000],
    sortBy: 'popularity',
    searchQuery: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const allProducts = getAllProducts();
        const allCategories = getAllCategories();
        const popularProducts = getPopularProducts(8);
        const saleProducts = getProductsOnSale(8);

        setProducts(allProducts);
        setCategories(allCategories);
        setFilteredProducts(allProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar y buscar productos
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Buscar por texto
    if (filters.searchQuery.trim()) {
      const searchResults = searchProducts(filtered, filters.searchQuery);
      filtered = searchResults.map(result => result.item);
    }

    // Ordenar
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
        filtered.sort((a, b) => {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    setFilters(prev => ({ ...prev, categories: selectedCategories }));
  };

  const handlePriceChange = (priceRange: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange }));
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToQuote = (product: Product) => {
    // Esta función se manejará en el Header
    console.log('Add to quote:', product);
  };

  const popularProducts = useMemo(() => getPopularProducts(8), []);
  const saleProducts = useMemo(() => getProductsOnSale(8), []);

  const getPriceRange = (): [number, number] => {
    if (products.length === 0) return [0, 1000000];
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-electribol-blue to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Iluminación de
                <span className="text-electribol-yellow"> Calidad</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Especialistas en lámparas, cables, reflectores y todo lo relacionado 
                con alumbrado. Calidad y servicio garantizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#productos"
                  className="btn-primary bg-white text-electribol-blue hover:bg-gray-100"
                >
                  Ver Productos
                </a>
                <a
                  href="https://wa.me/573015956954"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline border-white text-white hover:bg-white hover:text-electribol-blue"
                >
                  Contactar WhatsApp
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white/10 rounded-2xl backdrop-blur-sm p-8">
                <Image
                  src="/instagram_preview.png"
                  alt="ElectriBol - Productos de iluminación"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-electribol-blue rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Productos LED
              </h3>
              <p className="text-gray-600">
                Tecnología LED de última generación para máxima eficiencia energética
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-electribol-yellow rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-text-dark" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Calidad Garantizada
              </h3>
              <p className="text-gray-600">
                Productos certificados con garantía extendida y soporte técnico
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Envío Rápido
              </h3>
              <p className="text-gray-600">
                Despacho inmediato a toda Colombia con seguimiento en tiempo real
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Soporte 24/7
              </h3>
              <p className="text-gray-600">
                Atención personalizada y asesoría técnica especializada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Section */}
      <section id="categorias" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra amplia gama de productos para iluminación residencial, comercial e industrial
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 10).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange([category])}
                className="group p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-electribol-blue to-electribol-yellow rounded-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"></div>
                <h3 className="font-semibold text-gray-900 group-hover:text-electribol-blue transition-colors duration-200">
                  {category}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Productos Destacados
              </h2>
              <p className="text-xl text-gray-600">
                Los productos más populares de nuestra tienda
              </p>
            </div>
            <a
              href="#productos"
              className="hidden md:flex items-center space-x-2 text-electribol-blue hover:text-blue-700 transition-colors duration-200"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleProductSelect}
                onAddToQuote={handleAddToQuote}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ofertas Especiales
              </h2>
              <p className="text-xl text-gray-600">
                Aprovecha nuestros precios especiales por tiempo limitado
              </p>
            </div>
            <a
              href="#productos"
              className="hidden md:flex items-center space-x-2 text-electribol-blue hover:text-blue-700 transition-colors duration-200"
            >
              <span>Ver todas las ofertas</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleProductSelect}
                onAddToQuote={handleAddToQuote}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Filtros y Productos */}
      <section id="productos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todos los Productos
            </h2>
            <p className="text-xl text-gray-600">
              Explora nuestra completa gama de productos de iluminación
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filtros */}
            <div className="lg:col-span-1 space-y-6">
              <CategoryFilter
                categories={categories}
                selectedCategories={filters.categories}
                onCategoryChange={handleCategoryChange}
              />
              
              <PriceSlider
                minPrice={getPriceRange()[0]}
                maxPrice={getPriceRange()[1]}
                value={filters.priceRange}
                onChange={handlePriceChange}
              />
            </div>

            {/* Productos */}
            <div className="lg:col-span-3">
              {/* Controles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} productos encontrados
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Ordenar por:
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electribol-blue focus:border-transparent"
                  >
                    <option value="popularity">Popularidad</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="newest">Más Nuevos</option>
                  </select>
                </div>
              </div>

              {/* Grid de productos */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={handleProductSelect}
                      onAddToQuote={handleAddToQuote}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Intenta ajustar los filtros o buscar con otros términos
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        categories: [],
                        priceRange: getPriceRange(),
                        sortBy: 'popularity',
                        searchQuery: '',
                      });
                    }}
                    className="btn-primary"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToQuote={handleAddToQuote}
      />
    </div>
  );
}
