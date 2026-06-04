'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@electribol.com');
  const [password, setPassword] = useState('ElectriBol2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error || 'No fue posible iniciar sesion');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="surface w-full max-w-md space-y-5 p-6 md:p-8">
      <div>
        <p className="eyebrow">Acceso privado</p>
        <h1 className="mt-3 font-heading text-4xl uppercase tracking-[-0.05em] text-eb-900">
          Login de superadmin
        </h1>
        <p className="mt-3 text-sm leading-6 text-eb-700">
          La app ya soporta Supabase Auth para despliegue. Si no configuras Supabase, este acceso
          sigue funcionando en modo local fallback.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          className="field"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="admin-password">
          Contrasena
        </label>
        <input
          id="admin-password"
          type="password"
          className="field"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? 'Ingresando...' : 'Entrar al panel'}
      </button>
    </form>
  );
}
