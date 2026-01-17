import { Calendar, Filter, Mail, Pencil, Plus, Search, Shield, Users, UserX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getUsers } from '@/app/actions/users';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 12;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; status?: string; page?: string }>;
}) {
  const { search, role, status, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const result = await getUsers({ page: currentPage, limit: ITEMS_PER_PAGE });
  let users = result.data;

  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower),
    );
  }

  if (role) {
    users = users.filter((user) => user.role === role);
  }

  if (status) {
    users = users.filter((user) => user.status === status);
  }

  const roleCounts = {
    all: result.pagination.total,
    app_admin: result.data.filter((u) => u.role === 'app_admin').length,
    user: result.data.filter((u) => u.role === 'user').length,
  };

  const statusCounts = {
    active: result.data.filter((u) => u.status === 'active').length,
    inactive: result.data.filter((u) => u.status === 'inactive').length,
  };

  const getRoleStyle = (userRole: string) => {
    switch (userRole) {
      case 'app_admin':
        return 'bg-primary-light text-primary-brand';
      case 'user':
        return 'bg-info-light text-info';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getRoleLabel = (userRole: string) => {
    switch (userRole) {
      case 'app_admin':
        return 'Administrador';
      case 'user':
        return 'Usuario';
      default:
        return userRole;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-brand">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Usuarios</h1>
            <p className="text-sm text-neutral-500">
              Gestiona los usuarios y sus roles
              <span className="ml-2 text-neutral-400">({result.pagination.total} total)</span>
            </p>
          </div>
        </div>
        <Button asChild className="bg-gradient-brand text-white hover:opacity-90">
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/50 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <form>
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Buscar usuarios por nombre o email..."
                className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:border-primary-highlight focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-highlight/10"
              />
            </form>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {[
              { value: '', label: 'Todos', count: roleCounts.all },
              { value: 'app_admin', label: 'Admins', count: roleCounts.app_admin },
              { value: 'user', label: 'Usuarios', count: roleCounts.user },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/admin/users${option.value ? `?role=${option.value}` : ''}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  role === option.value || (!role && option.value === '')
                    ? 'bg-primary-light text-primary-brand'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    role === option.value || (!role && option.value === '')
                      ? 'bg-primary-brand text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {option.count}
                </span>
              </Link>
            ))}

            <div className="mx-1 h-6 w-px bg-neutral-200" />

            {[
              { value: 'active', label: 'Activos', count: statusCounts.active },
              { value: 'inactive', label: 'Inactivos', count: statusCounts.inactive },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/admin/users?status=${option.value}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  status === option.value
                    ? option.value === 'active'
                      ? 'bg-success-light text-success'
                      : 'bg-error-light text-error'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    status === option.value
                      ? option.value === 'active'
                        ? 'bg-success text-white'
                        : 'bg-error text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {option.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Button variant="outline" className="gap-2 lg:hidden">
          <Filter className="h-4 w-4" />
          Filtrar
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
            <Users className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">
            No se encontraron usuarios
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            {search || role ? 'Intenta ajustar los filtros' : 'Aún no hay usuarios creados'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`card-hover group relative overflow-hidden rounded-2xl border bg-white p-6 ${
                user.status === 'inactive'
                  ? 'border-neutral-300 opacity-60'
                  : 'border-neutral-200/50'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {user.status === 'inactive' && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-error-light px-2 py-1 text-xs font-medium text-error">
                    <UserX className="h-3 w-3" />
                    Inactivo
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="relative">
                  <div
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg font-bold text-white shadow-lg transition-transform group-hover:scale-110 ${
                      user.status === 'inactive'
                        ? 'bg-neutral-400'
                        : 'bg-gradient-brand shadow-brand'
                    }`}
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()
                    )}
                  </div>
                  {user.role === 'app_admin' && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-brand">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-neutral-900 truncate">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email.split('@')[0]}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getRoleStyle(user.role)}`}
                >
                  {getRoleLabel(user.role)}
                </span>
                {user.emailVerified && (
                  <span className="inline-flex items-center rounded-full bg-success-light px-2.5 py-1 text-xs font-medium text-success">
                    Verificado
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <Link href={`/admin/users/${user.id}/edit`} title="Editar usuario">
                      <Pencil className="h-4 w-4 text-neutral-500 hover:text-primary-brand" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
