'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber = '+573015956954',
  message = 'Hola Electribol, me interesa conocer más sobre sus productos de iluminación.',
  className = '',
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mostrar botón después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className={`whatsapp-float ${className}`}>
      {/* Botón principal */}
      <button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Botón de expansión */}
      <button
        onClick={handleExpand}
        className="absolute -top-2 -right-2 bg-electribol-yellow text-text-dark w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-yellow-400 transition-colors duration-200"
        aria-label="Ver opciones"
      >
        {isExpanded ? <X className="w-3 h-3" /> : '?'}
      </button>

      {/* Panel expandido */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-slide-in-right">
          <h3 className="font-semibold text-gray-900 mb-2">
            ¿Necesitas ayuda?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Contáctanos por WhatsApp para consultas, cotizaciones o soporte técnico.
          </p>
          
          <div className="space-y-2">
            <button
              onClick={handleClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Iniciar conversación</span>
            </button>
            
            <div className="text-xs text-gray-500 text-center">
              <p>Horario de atención:</p>
              <p>Lun-Vie: 8:00 AM - 6:00 PM</p>
              <p>Sáb: 8:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de notificación */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
    </div>
  );
}
