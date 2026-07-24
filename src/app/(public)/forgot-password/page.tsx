'use client';

import { ArrowLeft, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';

function ForgotPasswordForm() {
  const t = useTranslations('PasswordReset');
  const emailT = useTranslations('Email');
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'invalid_link' ? t('invalidLink') : null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('next', '/reset-password');

      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl.toString(),
      });

      if (resetError) {
        setError(t('requestError'));
        return;
      }

      setSent(true);
    } catch {
      setError(t('requestError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-neutral-50 via-white to-primary-light/20 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-2xl bg-dark-base px-3 py-2">
            <Logo size="md" />
          </div>
          <LocaleSwitcher />
        </div>

        <div className="rounded-3xl border border-neutral-200/70 bg-white p-8 shadow-xl shadow-primary-brand/5">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary-brand">
            <Mail className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900">{t('requestTitle')}</h1>
          <p className="mt-2 text-neutral-600">{t('requestDescription')}</p>

          {sent ? (
            <div className="mt-6 space-y-5">
              <output className="block rounded-xl border border-success/20 bg-success-light p-4 text-sm text-success-dark">
                {t('emailSent')}
              </output>
              <Button asChild variant="outline" className="h-11 w-full">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('backToLogin')}
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-error/20 bg-error-light p-4 text-sm text-error"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{emailT('label')}</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={emailT('loginPlaceholder')}
                    className="h-12 pl-11"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-gradient-brand text-white hover:opacity-90"
                disabled={submitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? t('sending') : t('sendLink')}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center text-sm font-medium text-primary-brand hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToLogin')}
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  const common = useTranslations('Common');

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">{common('loading')}</div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
