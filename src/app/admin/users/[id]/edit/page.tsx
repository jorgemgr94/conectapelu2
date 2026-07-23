import { ArrowLeft, UserCog } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/app/actions/users';
import { UserForm } from '@/components/admin/user-form';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations('Users');
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-brand">
            <UserCog className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{t('edit')}</h1>
            <p className="text-sm text-neutral-500">
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
        <UserForm user={user} />
      </div>
    </div>
  );
}
