'use client';

import Image from 'next/image';
import { GripVertical, ImagePlus, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Category, ProductWithCategory } from '@/types';
import { formatCurrency } from '@/utils/format';

type ProductFormState = {
  id?: string;
  name: string;
  reference: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  priceOnRequest: boolean;
  unit: string;
  shortDescription: string;
  description: string;
  images: string[];
  available: boolean;
  featured: boolean;
};

function createEmptyProduct(categoryId: string): ProductFormState {
  return {
    name: '',
    reference: '',
    categoryId,
    price: '',
    compareAtPrice: '',
    priceOnRequest: false,
    unit: 'unidad',
    shortDescription: '',
    description: '',
    images: [],
    available: true,
    featured: false,
  };
}

function mapProductToForm(product: ProductWithCategory): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    reference: product.reference,
    categoryId: product.categoryId,
    price: product.price?.toString() || '',
    compareAtPrice: product.compareAtPrice?.toString() || '',
    priceOnRequest: product.priceOnRequest,
    unit: product.unit,
    shortDescription: product.shortDescription,
    description: product.description,
    images: product.images,
    available: product.available,
    featured: product.featured,
  };
}

export default function AdminProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: ProductWithCategory[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<ProductFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const activeCategories = useMemo(() => categories.filter((category) => category.active), [categories]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  };

  const refreshProducts = async () => {
    const response = await fetch('/api/products');
    const data = (await response.json()) as ProductWithCategory[];
    setProducts(data);
  };

  const handleToggle = async (productId: string, field: 'available' | 'featured', value: boolean) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    });

    if (!response.ok) {
      showToast('No fue posible actualizar el producto');
      return;
    }

    await refreshProducts();
  };

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm('Se eliminara este producto. ¿Deseas continuar?');
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    if (!response.ok) {
      showToast('No fue posible eliminar el producto');
      return;
    }

    await refreshProducts();
    showToast('Producto eliminado');
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !editing) {
      return;
    }

    setUploading(true);
    const formData = new FormData();

    Array.from(files).slice(0, 10 - editing.images.length).forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setUploading(false);

    if (!response.ok) {
      showToast('No fue posible subir las imagenes');
      return;
    }

    const data = (await response.json()) as { files: string[] };
    setEditing({ ...editing, images: [...editing.images, ...data.files].slice(0, 10) });
  };

  const handleSave = async () => {
    if (!editing) {
      return;
    }

    setSaving(true);

    const payload = {
      id: editing.id,
      name: editing.name,
      reference: editing.reference,
      categoryId: editing.categoryId,
      price: editing.priceOnRequest ? null : editing.price ? Number(editing.price) : null,
      compareAtPrice: editing.compareAtPrice ? Number(editing.compareAtPrice) : null,
      priceOnRequest: editing.priceOnRequest,
      unit: editing.unit,
      shortDescription: editing.shortDescription,
      description: editing.description,
      images: editing.images,
      available: editing.available,
      featured: editing.featured,
    };

    const response = await fetch(editing.id ? `/api/products/${editing.id}` : '/api/products', {
      method: editing.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      showToast('No fue posible guardar el producto');
      return;
    }

    setEditing(null);
    await refreshProducts();
    showToast('Producto guardado');
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!editing || fromIndex === toIndex) {
      return;
    }

    const images = [...editing.images];
    const [moved] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, moved);
    setEditing({ ...editing, images });
  };

  return (
    <div className="space-y-6">
      {toast ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {toast}
        </div>
      ) : null}

      <div className="surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Gestion de productos</p>
          <h2 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
            Catalogo editable
          </h2>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setEditing(createEmptyProduct(activeCategories[0]?.id || categories[0]?.id || ''))}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="surface overflow-x-auto">
        <table className="min-w-full text-sm text-eb-800">
          <thead className="border-b border-eb-300/10 text-left font-heading text-xs uppercase tracking-[0.14em] text-eb-700">
            <tr>
              <th className="px-4 py-4">Producto</th>
              <th className="px-4 py-4">Categoria</th>
              <th className="px-4 py-4">Precio</th>
              <th className="px-4 py-4">Disponible</th>
              <th className="px-4 py-4">Destacado</th>
              <th className="px-4 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-eb-300/10 last:border-b-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-20 overflow-hidden rounded-lg border border-eb-300/10 bg-eb-100">
                      <Image
                        src={product.images[0] || '/og-electribol.svg'}
                        alt={product.name}
                        fill
                        sizes="80px"
                        unoptimized={Boolean(product.images[0]?.startsWith('data:'))}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                        {product.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-eb-700">
                        Ref. {product.reference}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{product.category?.name || '-'}</td>
                <td className="px-4 py-4">
                  {formatCurrency(product.priceOnRequest ? null : product.price)}
                </td>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={product.available}
                    onChange={(event) => handleToggle(product.id, 'available', event.target.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(event) => handleToggle(product.id, 'featured', event.target.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="btn-admin" onClick={() => setEditing(mapProductToForm(product))}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="btn-secondary" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="surface p-5 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow">{editing.id ? 'Editar producto' : 'Crear producto'}</p>
              <h3 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
                {editing.id ? editing.name || 'Editar referencia' : 'Nueva referencia'}
              </h3>
            </div>
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Nombre</label>
              <input
                className="field"
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
              />
            </div>
            <div>
              <label className="label">Referencia</label>
              <input
                className="field"
                value={editing.reference}
                onChange={(event) => setEditing({ ...editing, reference: event.target.value })}
              />
            </div>
            <div>
              <label className="label">Categoria</label>
              <select
                className="field"
                value={editing.categoryId}
                onChange={(event) => setEditing({ ...editing, categoryId: event.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Unidad</label>
              <input
                className="field"
                value={editing.unit}
                onChange={(event) => setEditing({ ...editing, unit: event.target.value })}
              />
            </div>
            <div>
              <label className="label">Precio COP</label>
              <input
                type="number"
                className="field"
                value={editing.price}
                disabled={editing.priceOnRequest}
                onChange={(event) => setEditing({ ...editing, price: event.target.value })}
              />
            </div>
            <div>
              <label className="label">Precio anterior</label>
              <input
                type="number"
                className="field"
                value={editing.compareAtPrice}
                onChange={(event) => setEditing({ ...editing, compareAtPrice: event.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-eb-800">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.priceOnRequest}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    priceOnRequest: event.target.checked,
                    price: event.target.checked ? '' : editing.price,
                  })
                }
              />
              Precio a consultar
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.available}
                onChange={(event) => setEditing({ ...editing, available: event.target.checked })}
              />
              Disponible
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(event) => setEditing({ ...editing, featured: event.target.checked })}
              />
              Destacado
            </label>
          </div>

          <div className="mt-4">
            <label className="label">Descripcion corta</label>
            <textarea
              className="field min-h-[110px]"
              value={editing.shortDescription}
              onChange={(event) => setEditing({ ...editing, shortDescription: event.target.value })}
            />
          </div>

          <div className="mt-4">
            <label className="label">Descripcion</label>
            <textarea
              className="field min-h-[160px]"
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
            />
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="label !mb-0">Imagenes</label>
              <label className="btn-secondary cursor-pointer">
                <ImagePlus className="mr-2 h-4 w-4" />
                {uploading ? 'Subiendo...' : 'Subir imagenes'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={(event) => void handleImageUpload(event.target.files)}
                />
              </label>
            </div>

            <div
              className="rounded-2xl border border-dashed border-eb-300/30 bg-eb-50/60 p-4 text-sm text-eb-700"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void handleImageUpload(event.dataTransfer.files);
              }}
            >
              Arrastra imagenes aqui o usa el boton. Maximo 10 archivos de hasta 5MB.
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {editing.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="rounded-2xl border border-eb-300/10 bg-white p-2 shadow-sm"
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null) {
                      moveImage(dragIndex, index);
                      setDragIndex(null);
                    }
                  }}
                >
                  <div className="mb-2 flex items-center justify-between text-xs text-eb-700">
                    <div className="inline-flex items-center gap-2">
                      <GripVertical className="h-4 w-4" />
                      {index === 0 ? 'Principal' : `Imagen ${index + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          images: editing.images.filter((_, imageIndex) => imageIndex !== index),
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Image
                    src={image}
                    alt={`Preview ${index + 1}`}
                    width={400}
                    height={300}
                    className="aspect-[4/3] h-auto w-full rounded-xl object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" disabled={saving} onClick={() => void handleSave()}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
