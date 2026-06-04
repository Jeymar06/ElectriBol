'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Download, LayoutDashboard, ListTree, LogOut, Package } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: ListTree },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="surface flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="eyebrow">Superadmin</p>
        <h1 className="mt-2 font-heading text-3xl uppercase tracking-[-0.04em] text-eb-900">
          Panel ElectriBol
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-heading text-xs uppercase tracking-[0.14em] transition ${
                active
                  ? 'bg-eb-50 text-eb-900'
                  : 'border border-eb-300/20 text-eb-700 hover:border-eb-300/40 hover:text-eb-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <a href="/api/admin/analytics-export" className="btn-secondary">
          <Download className="mr-2 h-4 w-4" />
          Exportar metricas
        </a>

        <button type="button" onClick={handleLogout} className="btn-secondary">
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </button>
      </div>
    </div>
  );
}
