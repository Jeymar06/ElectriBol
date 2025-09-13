'use client';

import React from 'react';
import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { QuoteItem } from '@/types';
import { formatPrice } from '@/lib/products';

interface QuoteListProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  totalPrice: number;
}

export default function QuoteList({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  totalPrice,
}: QuoteListProps) {
  if (!isOpen) return null;

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';
    
    let message = 'Hola Electribol, me interesa cotizar los siguientes productos:\n\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   SKU: ${item.sku}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio unitario: $${item.price.toLocaleString('es-CO')} COP\n`;
      message += `   Subtotal: $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n\n`;
    });
    
    message += `Total: $${totalPrice.toLocaleString('es-CO')} COP\n\n`;
    message += '¿Podrían enviarme más información sobre disponibilidad y descuentos por cantidad?';
    
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/573015956954?text=${generateWhatsAppMessage()}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl" data-testid="quote-panel">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Cotización ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Cerrar cotización"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu cotización está vacía
                </h3>
                <p className="text-gray-500 mb-4">
                  Agrega productos para crear una cotización
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {item.title.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        SKU: {item.sku}
                      </p>
                      <p className="text-sm font-semibold text-electribol-blue">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Cantidad */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-xl font-bold text-electribol-blue">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar por WhatsApp</span>
                </a>
                
                <button
                  onClick={onClose}
                  className="w-full btn-outline"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
