'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const t = useTranslations('PasswordReset');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(t('passwordLength'));
      return;
    }

    if (password !== confirmation) {
      setError(t('passwordMismatch'));
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(t('updateError'));
        return;
      }

      await supabase.auth.signOut();
      router.replace('/login?passwordReset=success');
    } catch {
      setError(t('updateError'));
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
            <Lock className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900">{t('updateTitle')}</h1>
          <p className="mt-2 text-neutral-600">{t('updateDescription')}</p>

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
              <Label htmlFor="password">{t('newPassword')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                className="h-12"
                required
              />
              <p className="text-xs text-neutral-500">{t('passwordHelp')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">{t('confirmPassword')}</Label>
              <Input
                id="confirmation"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                minLength={8}
                className="h-12"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-brand text-white hover:opacity-90"
              disabled={submitting}
            >
              {submitting ? t('updating') : t('updatePassword')}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
