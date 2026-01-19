import { Building2, Filter, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import type { Organization } from '@/app/actions/organizations';
import { getOrganizations } from '@/app/actions/organizations';
import { OrganizationsGrid } from '@/components/admin';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 12;

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const { search, status, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  // Build filters from search params
  const filters = {
    search: search || undefined,
    status: (status as Organization['status']) || undefined,
  };

  // Fetch organizations with server-side filtering
  const result = await getOrganizations({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    filters,
  });

  // Fetch counts for each status (without pagination, just counts)
  const [allCount, activeCount, pendingCount, suspendedCount] = await Promise.all([
    getOrganizations({ page: 1, limit: 1, filters: { search } }),
    getOrganizations({ page: 1, limit: 1, filters: { search, status: 'active' } }),
    getOrganizations({ page: 1, limit: 1, filters: { search, status: 'pending' } }),
    getOrganizations({ page: 1, limit: 1, filters: { search, status: 'suspended' } }),
  ]);

  const statusCounts = {
    all: allCount.pagination.total,
    active: activeCount.pagination.total,
    pending: pendingCount.pagination.total,
    suspended: suspendedCount.pagination.total,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-brand">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Organizaciones</h1>
            <p className="text-sm text-neutral-500">
              Gestiona organizaciones de rescate y refugios
              <span className="ml-2 text-neutral-400">({result.pagination.total} total)</span>
            </p>
          </div>
        </div>
        <Button asChild className="bg-gradient-brand text-white shadow-brand hover:opacity-90">
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Organización
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/50 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <form>
              {status && <input type="hidden" name="status" value={status} />}
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Buscar organizaciones..."
                className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:border-primary-highlight focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-highlight/10"
              />
            </form>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {[
              { value: '', label: 'Todas', count: statusCounts.all },
              { value: 'active', label: 'Activas', count: statusCounts.active },
              { value: 'pending', label: 'Pendientes', count: statusCounts.pending },
              { value: 'suspended', label: 'Suspendidas', count: statusCounts.suspended },
            ].map((option) => {
              // Build URL preserving search param
              const params = new URLSearchParams();
              if (search) params.set('search', search);
              if (option.value) params.set('status', option.value);
              const queryString = params.toString();
              const href = `/admin/organizations${queryString ? `?${queryString}` : ''}`;

              return (
                <Link
                  key={option.value}
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    status === option.value || (!status && option.value === '')
                      ? 'bg-primary-light text-primary-brand'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {option.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      status === option.value || (!status && option.value === '')
                        ? 'bg-primary-brand text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {option.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <Button variant="outline" className="gap-2 lg:hidden">
          <Filter className="h-4 w-4" />
          Filtrar
        </Button>
      </div>

      <OrganizationsGrid data={result} hasFilters={!!(search || status)} />
    </div>
  );
}
