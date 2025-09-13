'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ShoppingCart, Phone } from 'lucide-react';
import SearchBar from './SearchBar';
import QuoteList from './QuoteList';
import { QuoteItem } from '@/types';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function Header({ onSearch, searchQuery = '' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Cargar cotización desde localStorage
  useEffect(() => {
    const savedQuote = localStorage.getItem('electribol-quote');
    if (savedQuote) {
      setQuoteItems(JSON.parse(savedQuote));
    }
  }, []);

  // Guardar cotización en localStorage
  useEffect(() => {
    localStorage.setItem('electribol-quote', JSON.stringify(quoteItems));
  }, [quoteItems]);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToQuote = (product: any) => {
    const existingItem = quoteItems.find(item => item.id === product.id);
    if (existingItem) {
      setQuoteItems(items =>
        items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setQuoteItems(items => [
        ...items,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          sku: product.sku,
        },
      ]);
    }
  };

  const removeFromQuote = (productId: string) => {
    setQuoteItems(items => items.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
    } else {
      setQuoteItems(items =>
        items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return quoteItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return quoteItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg backdrop-blur-sm'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-electribol-blue to-electribol-yellow rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-text-dark">ElectriBol</span>
            </Link>

            {/* Navegación desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-electribol-blue transition-colors duration-200"
              >
                Inicio
              </Link>
              <Link
                href="/#categorias"
                className="text-gray-700 hover:text-electribol-blue transition-colors duration-200"
              >
                Categorías
              </Link>
              <Link
                href="/#productos"
                className="text-gray-700 hover:text-electribol-blue transition-colors duration-200"
              >
                Productos
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-electribol-blue transition-colors duration-200"
              >
                Contacto
              </Link>
            </nav>

            {/* Búsqueda desktop */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <SearchBar onSearch={onSearch} initialValue={searchQuery} />
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/573015956954"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                aria-label="Contactar por WhatsApp"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>

              {/* Cotización */}
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="relative p-2 text-gray-700 hover:text-electribol-blue transition-colors duration-200"
                aria-label="Ver cotización"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-electribol-yellow text-text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Menú móvil */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-electribol-blue transition-colors duration-200"
                aria-label="Abrir menú"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Búsqueda móvil */}
          <div className="md:hidden pb-4">
            <SearchBar onSearch={onSearch} initialValue={searchQuery} />
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-gray-700 hover:text-electribol-blue transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/#categorias"
                className="block text-gray-700 hover:text-electribol-blue transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                href="/#productos"
                className="block text-gray-700 hover:text-electribol-blue transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-electribol-blue transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <a
                href="https://wa.me/573015956954"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Lista de cotización */}
      <QuoteList
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        items={quoteItems}
        onRemove={removeFromQuote}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
      />

      {/* Espaciador para el header fijo */}
      <div className="h-16" />
    </>
  );
}
