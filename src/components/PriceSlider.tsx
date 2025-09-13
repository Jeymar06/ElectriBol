'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface PriceSliderProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export default function PriceSlider({
  minPrice,
  maxPrice,
  value,
  onChange,
  className = '',
}: PriceSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 1000);
    const newValue: [number, number] = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 1000);
    const newValue: [number, number] = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const percentageMin = ((localValue[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const percentageMax = ((localValue[1] - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Rango de Precio
        </h3>
        <button
          onClick={() => onChange([minPrice, maxPrice])}
          className="text-sm text-electribol-blue hover:text-blue-700 transition-colors duration-200"
        >
          Limpiar
        </button>
      </div>

      {/* Slider visual */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-lg">
          <div
            className="absolute h-2 bg-electribol-blue rounded-lg"
            style={{
              left: `${percentageMin}%`,
              width: `${percentageMax - percentageMin}%`,
            }}
          />
        </div>
        
        {/* Min thumb */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: 1 }}
        />
        
        {/* Max thumb */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
      </div>

      {/* Inputs numéricos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio mínimo
          </label>
          <div className="relative">
            <Minus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={localValue[0]}
              onChange={handleMinChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electribol-blue focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio máximo
          </label>
          <div className="relative">
            <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min={minPrice}
              max={maxPrice}
              value={localValue[1]}
              onChange={handleMaxChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electribol-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Valores actuales */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{formatPrice(localValue[0])}</span>
        <span className="text-electribol-blue font-medium">
          {formatPrice(localValue[1])}
        </span>
      </div>
    </div>
  );
}
