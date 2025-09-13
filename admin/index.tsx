'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { Product } from '../src/types';

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123';

  useEffect(() => {
    // Verificar si ya está autenticado
    const authStatus = localStorage.getItem('admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadProducts();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      loadProducts();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-auth');
    setPassword('');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditing(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSave = () => {
    if (editingProduct) {
      if (isEditing) {
        // Editar producto existente
        setProducts(products.map(p => 
          p.id === editingProduct.id ? editingProduct : p
        ));
      } else {
        // Agregar nuevo producto
        const newProduct = {
          ...editingProduct,
          id: String(products.length + 1).padStart(3, '0'),
          createdAt: new Date().toISOString(),
        };
        setProducts([...products, newProduct]);
      }
      setEditingProduct(null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsEditing(false);
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: '',
      title: '',
      category: '',
      price: 0,
      currency: 'COP',
      images: [''],
      shortDescription: '',
      description: '',
      tags: [],
      sku: '',
      stock: 0,
      rating: 0,
      popular: false,
      createdAt: '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa la contraseña para acceder
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input pr-10"
                  placeholder="Ingresa la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">
                Gestiona los productos de ElectriBol
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="btn-outline"
              >
                Ver sitio web
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón agregar */}
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Producto</span>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="bg-white shadow-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popular
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {product.title.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toLocaleString('es-CO')} COP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.popular
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.popular ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-electribol-blue hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de edición */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Editar Producto' : 'Agregar Producto'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        title: e.target.value
                      })}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Categoría</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        category: e.target.value
                      })}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value)
                      })}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value)
                      })}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">SKU</label>
                    <input
                      type="text"
                      value={editingProduct.sku}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        sku: e.target.value
                      })}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editingProduct.rating}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        rating: Number(e.target.value)
                      })}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Descripción Corta</label>
                  <textarea
                    value={editingProduct.shortDescription}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      shortDescription: e.target.value
                    })}
                    className="form-input"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="form-label">Descripción</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      description: e.target.value
                    })}
                    className="form-input"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="form-label">Tags (separados por comas)</label>
                  <input
                    type="text"
                    value={editingProduct.tags.join(', ')}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="form-input"
                    placeholder="LED, Exterior, 30W"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingProduct.popular}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        popular: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Producto popular</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
