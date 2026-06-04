'use client';

import { Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Category, ProductWithCategory } from '@/types';

type CategoryFormState = {
  id?: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
};

function createEmptyCategory(): CategoryFormState {
  return {
    name: '',
    description: '',
    icon: 'Lightbulb',
    active: true,
  };
}

export default function AdminCategoriesManager({
  initialCategories,
  products,
}: {
  initialCategories: Category[];
  products: ProductWithCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<CategoryFormState | null>(null);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return categories.filter((category) => {
      if (normalizedQuery.length === 0) {
        return true;
      }

      return (
        category.name.toLowerCase().includes(normalizedQuery) ||
        category.description.toLowerCase().includes(normalizedQuery) ||
        category.icon.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [categories, query]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  };

  const refresh = async () => {
    const response = await fetch('/api/categories');
    const data = (await response.json()) as Category[];
    setCategories(data);
  };

  const handleDelete = async (categoryId: string) => {
    const confirmed = window.confirm('Se eliminara esta categoria si no tiene productos asociados. ¿Continuar?');
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      showToast(data.error || 'No fue posible eliminar la categoria');
      return;
    }

    await refresh();
    showToast('Categoria eliminada');
  };

  const handleToggle = async (categoryId: string, active: boolean) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      showToast('No fue posible actualizar la categoria');
      return;
    }

    await refresh();
  };

  const handleSave = async () => {
    if (!editing) {
      return;
    }

    const response = await fetch(editing.id ? `/api/categories/${editing.id}` : '/api/categories', {
      method: editing.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });

    if (!response.ok) {
      showToast('No fue posible guardar la categoria');
      return;
    }

    setEditing(null);
    await refresh();
    showToast('Categoria guardada');
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
          <p className="eyebrow">Gestion de categorias</p>
          <h2 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
            Familias del catalogo
          </h2>
        </div>
        <button type="button" className="btn-primary" onClick={() => setEditing(createEmptyCategory())}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva categoria
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <label className="surface flex items-center gap-3 px-4 py-3">
          <Search className="h-4 w-4 text-eb-700" />
          <input
            type="search"
            className="w-full bg-transparent text-sm text-eb-900 outline-none placeholder:text-eb-700"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, icono o descripcion"
          />
        </label>
        <div className="stat-card">
          <p className="font-heading text-xs uppercase tracking-[0.14em] text-eb-700">Activas</p>
          <p className="mt-4 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
            {categories.filter((category) => category.active).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="font-heading text-xs uppercase tracking-[0.14em] text-eb-700">Con productos</p>
          <p className="mt-4 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
            {categories.filter((category) => products.some((product) => product.categoryId === category.id)).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="font-heading text-xs uppercase tracking-[0.14em] text-eb-700">Sin uso</p>
          <p className="mt-4 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
            {categories.filter((category) => !products.some((product) => product.categoryId === category.id)).length}
          </p>
        </div>
      </div>

      <div className="surface overflow-x-auto">
        <table className="min-w-full text-sm text-eb-800">
          <thead className="border-b border-eb-300/10 text-left font-heading text-xs uppercase tracking-[0.14em] text-eb-700">
            <tr>
              <th className="px-4 py-4">Nombre</th>
              <th className="px-4 py-4">Descripcion</th>
              <th className="px-4 py-4">Productos</th>
              <th className="px-4 py-4">Activa</th>
              <th className="px-4 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id} className="border-b border-eb-300/10 last:border-b-0">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-heading text-lg uppercase tracking-[-0.03em] text-eb-900">
                      {category.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-eb-700">{category.icon}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-eb-700">{category.description}</td>
                <td className="px-4 py-4 text-eb-700">
                  {products.filter((product) => product.categoryId === category.id).length}
                </td>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={category.active}
                    onChange={(event) => void handleToggle(category.id, event.target.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn-admin" onClick={() => setEditing({ ...category })}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => void handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-eb-700">
                  No hay categorias que coincidan con la busqueda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {editing ? (
        <div className="surface p-5 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow">{editing.id ? 'Editar categoria' : 'Crear categoria'}</p>
              <h3 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
                {editing.name || 'Nueva categoria'}
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
              <label className="label">Icono</label>
              <select
                className="field"
                value={editing.icon}
                onChange={(event) => setEditing({ ...editing, icon: event.target.value })}
              >
                <option value="Lightbulb">Lightbulb</option>
                <option value="Cable">Cable</option>
                <option value="LampWallUp">LampWallUp</option>
                <option value="ShieldHalf">ShieldHalf</option>
                <option value="Boxes">Boxes</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Descripcion</label>
            <textarea
              className="field min-h-[140px]"
              value={editing.description}
              onChange={(event) => setEditing({ ...editing, description: event.target.value })}
            />
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm text-eb-800">
            <input
              type="checkbox"
              checked={editing.active}
              onChange={(event) => setEditing({ ...editing, active: event.target.checked })}
            />
            Categoria activa
          </label>

          <div className="mt-6 flex gap-3">
            <button type="button" className="btn-primary" onClick={() => void handleSave()}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
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
