'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryChange,
  className = '',
}: CategoryFilterProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      onCategoryChange([]);
    } else {
      onCategoryChange([...categories]);
    }
  };

  const isAllSelected = selectedCategories.length === categories.length;
  const isSomeSelected = selectedCategories.length > 0 && selectedCategories.length < categories.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Categorías
        </h3>
        <button
          onClick={handleSelectAll}
          className="text-sm text-electribol-blue hover:text-blue-700 transition-colors duration-200"
        >
          {isAllSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <label
              key={category}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-electribol-blue border-electribol-blue'
                      : 'border-gray-300 hover:border-electribol-blue'
                  }`}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700 flex-1">
                {category}
              </span>
            </label>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center space-x-1 bg-electribol-blue text-white text-xs px-2 py-1 rounded-full"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="hover:bg-blue-700 rounded-full p-0.5 transition-colors duration-200"
                  aria-label={`Quitar ${category}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
