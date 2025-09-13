import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-electribol-blue to-electribol-yellow rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">ElectriBol</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Especialistas en lámparas, cables, reflectores y todo lo relacionado 
              con alumbrado. Calidad y servicio garantizado.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/573015956954"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/#categorias"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/#productos"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#categorias?cat=lamparas-led"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Lámparas LED
                </Link>
              </li>
              <li>
                <Link
                  href="/#categorias?cat=cables-electricos"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cables Eléctricos
                </Link>
              </li>
              <li>
                <Link
                  href="/#categorias?cat=reflectores"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Reflectores
                </Link>
              </li>
              <li>
                <Link
                  href="/#categorias?cat=iluminacion-exterior"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Iluminación Exterior
                </Link>
              </li>
              <li>
                <Link
                  href="/#categorias?cat=accesorios"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-electribol-yellow mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Carrera 3 #11-30<br />
                    Barrio 23 de enero<br />
                    Cantagallo, Bolívar
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-electribol-yellow flex-shrink-0" />
                <a
                  href="tel:+573015956954"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  +57 301 595 6954
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-electribol-yellow flex-shrink-0" />
                <a
                  href="mailto:info@electribol.com"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  info@electribol.com
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-electribol-yellow mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Lunes - Viernes: 8:00 AM - 6:00 PM<br />
                    Sábados: 8:00 AM - 2:00 PM<br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} ElectriBol. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
