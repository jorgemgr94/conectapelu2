'use client';

import { ArrowRight, Building2, Heart, Lock, Mail, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { getLoginRedirectPath } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect');
  const action = searchParams.get('action');
  const petId = searchParams.get('petId');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (redirectUrl) {
        let finalRedirect = redirectUrl;
        if (action && petId) {
          const separator = redirectUrl.includes('?') ? '&' : '?';
          finalRedirect = `${redirectUrl}${separator}action=${action}&petId=${petId}`;
        }
        router.replace(finalRedirect);
        return;
      }

      const redirectPath = await getLoginRedirectPath();
      router.replace(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      setError('Ha ocurrido un error. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-dark-page">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary-brand/30 blur-3xl animate-float" />
          <div
            className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-primary-highlight/20 blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-brand/10 blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12">
          <Logo size="lg" tagline="Conectando Peludos" />

          <div className="flex-1 flex items-center">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-primary-highlight backdrop-blur-sm mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Únete a nuestra comunidad</span>
              </div>
              <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                Donde los peludos encuentran{' '}
                <span className="text-secondary-highlight">su hogar</span>
              </h1>
              <p className="text-lg text-neutral-400 mb-8">
                Cada peludo merece una familia que lo ame. Juntos hacemos posible esa conexión
                mágica entre corazones.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-primary-brand/20 mb-3">
                    <Building2 className="h-6 w-6 text-primary-highlight" />
                  </div>
                  <p className="text-2xl font-bold text-white">24+</p>
                  <p className="text-sm text-neutral-500">Organizaciones</p>
                </div>
                <div className="text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-error/20 mb-3">
                    <Heart className="h-6 w-6 text-error" />
                  </div>
                  <p className="text-2xl font-bold text-white">892</p>
                  <p className="text-sm text-neutral-500">Adopciones</p>
                </div>
                <div className="text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-tertiary-highlight/20 mb-3">
                    <Users className="h-6 w-6 text-tertiary-highlight" />
                  </div>
                  <p className="text-2xl font-bold text-white">2.8k</p>
                  <p className="text-sm text-neutral-500">Familias</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-neutral-600">© 2026 ConectaPelu2. Hecho con 💜</div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-linear-to-br from-neutral-50 via-white to-primary-light/20 p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Logo size="lg" href={undefined} className="justify-center" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">¡Bienvenido de vuelta!</h2>
            <p className="mt-2 text-neutral-600">Inicia sesión para continuar conectando peludos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-error-light border border-error/20 p-4 text-sm text-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-neutral-200 bg-white pl-11 text-neutral-900 shadow-sm focus:border-primary-highlight focus:ring-4 focus:ring-primary-highlight/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                  Contraseña
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-brand hover:text-primary-dark transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-neutral-200 bg-white pl-11 text-neutral-900 shadow-sm focus:border-primary-highlight focus:ring-4 focus:ring-primary-highlight/10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-brand text-white shadow-brand hover:opacity-90 transition-all hover:shadow-brand-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-neutral-500">¿Nuevo en ConectaPelu2?</span>
            </div>
          </div>

          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-all hover:border-primary-highlight/50 hover:bg-primary-light/20 hover:text-primary-brand"
          >
            Crear una cuenta
          </Link>

          <p className="mt-8 text-center text-xs text-neutral-500">
            Al iniciar sesión, aceptas nuestros{' '}
            <Link href="/terms" className="underline hover:text-neutral-700 transition-colors">
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link href="/privacy" className="underline hover:text-neutral-700 transition-colors">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
