import { Building2, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';
import type { Organization } from '@/app/actions/organizations';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import type { PaginatedResult } from '@/lib/types';

interface OrganizationsGridProps {
  data: PaginatedResult<Organization>;
  /** Whether any filters are currently applied (for empty state message) */
  hasFilters?: boolean;
}

export function OrganizationsGrid({ data, hasFilters = false }: OrganizationsGridProps) {
  const format = useFormatter();
  const t = useTranslations('Organizations');
  const { data: organizations, pagination } = data;

  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <Building2 className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-neutral-900">{t('empty')}</h3>
        <p className="mt-1 text-sm text-neutral-500">
          {hasFilters ? t('adjustFilters') : t('createFirst')}
        </p>
        {!hasFilters && (
          <Button asChild className="mt-4" variant="outline">
            <Link href="/admin/organizations/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('create')}
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org, index) => (
          <div
            key={org.id}
            className="card-hover group relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-6 transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute right-4 top-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  org.status === 'active'
                    ? 'bg-success-light text-success'
                    : org.status === 'pending'
                      ? 'bg-warning-light text-warning'
                      : 'bg-error-light text-error'
                }`}
              >
                {org.status === 'active'
                  ? t('active')
                  : org.status === 'pending'
                    ? t('pending')
                    : t('suspended')}
              </span>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-light to-primary-highlight-light transition-transform group-hover:scale-110">
                <span className="text-xl font-bold text-primary-brand">{org.name.charAt(0)}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-semibold text-neutral-900">{org.name}</h3>
                <code className="text-xs text-neutral-500">{org.slug}</code>
                {org.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{org.description}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className="text-xs text-neutral-400">
                {t('createdOn', {
                  date: format.dateTime(new Date(org.createdAt), {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                })}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  asChild
                >
                  <Link href={`/org/${org.slug}/dashboard`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  asChild
                >
                  <Link href={`/admin/organizations/${org.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:bg-error-light hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        baseUrl="/admin/organizations"
        total={pagination.total}
        limit={pagination.limit}
        itemLabel={t('items')}
      />
    </div>
  );
}
