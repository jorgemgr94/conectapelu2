import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Calendar,
  Heart,
  MoreHorizontal,
  PawPrint,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stats = [
  {
    name: 'Organizaciones',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Building2,
    gradient: 'bg-gradient-brand',
    bgGradient: 'from-primary-brand/10 to-primary-highlight/5',
    glowClass: 'stat-glow-primary',
  },
  {
    name: 'Usuarios Activos',
    value: '2,847',
    change: '+23%',
    changeType: 'positive' as const,
    icon: Users,
    gradient: 'bg-gradient-tertiary',
    bgGradient: 'from-tertiary-highlight/10 to-tertiary-highlight/5',
    glowClass: 'stat-glow-tertiary',
  },
  {
    name: 'Peludos Listados',
    value: '1,234',
    change: '+8%',
    changeType: 'positive' as const,
    icon: PawPrint,
    gradient: 'bg-linear-to-br from-secondary-highlight to-secondary-highlight-dark',
    bgGradient: 'from-secondary-highlight/10 to-secondary-highlight/5',
    glowClass: 'stat-glow-secondary',
  },
  {
    name: 'Adopciones',
    value: '892',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Heart,
    gradient: 'bg-linear-to-br from-error to-error-dark',
    bgGradient: 'from-error/10 to-error/5',
    glowClass: 'stat-glow-error',
  },
];

const recentOrganizations = [
  { id: 1, name: 'Patitas Felices', status: 'active', members: 12, pets: 45 },
  { id: 2, name: 'Fundación Peludos', status: 'pending', members: 8, pets: 23 },
  { id: 3, name: 'Segunda Oportunidad', status: 'active', members: 15, pets: 67 },
  { id: 4, name: 'Amigos Felinos', status: 'active', members: 6, pets: 34 },
];

const activityFeed = [
  {
    id: 1,
    action: 'Nueva organización registrada',
    org: 'Patitas Felices',
    time: 'hace 2m',
    type: 'org',
  },
  { id: 2, action: 'Peludo adoptado', org: 'Luna → María G.', time: 'hace 15m', type: 'adoption' },
  {
    id: 3,
    action: 'Nuevo usuario registrado',
    org: 'carlos@email.com',
    time: 'hace 1h',
    type: 'user',
  },
  {
    id: 4,
    action: 'Organización aprobada',
    org: 'Fundación Peludos',
    time: 'hace 2h',
    type: 'approved',
  },
  { id: 5, action: 'Peludo listado', org: 'Max (Labrador)', time: 'hace 3h', type: 'pet' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-dark-page p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-brand/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-highlight/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary-highlight" />
              <span className="text-sm font-medium text-primary-highlight">
                Admin de Plataforma
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">¡Bienvenido de vuelta, Admin!</h1>
            <p className="text-neutral-400">Esto es lo que está pasando en tu plataforma hoy.</p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <span>
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <Button className="bg-gradient-brand text-white hover:opacity-90">
              <Activity className="mr-2 h-4 w-4" />
              Ver Reportes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className={`card-hover group relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-6 ${stat.glowClass}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.gradient}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    stat.changeType === 'positive'
                      ? 'bg-success-light text-success'
                      : 'bg-error-light text-error'
                  }`}
                >
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Organizaciones Recientes</h2>
                <p className="text-sm text-neutral-500">Últimas organizaciones registradas</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/organizations">Ver todas</Link>
              </Button>
            </div>
            <div className="divide-y divide-neutral-100">
              {recentOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-primary-light to-primary-highlight-light">
                      <span className="text-lg font-bold text-primary-brand">
                        {org.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{org.name}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {org.members} miembros
                        </span>
                        <span className="flex items-center gap-1">
                          <PawPrint className="h-3 w-3" />
                          {org.pets} peludos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        org.status === 'active'
                          ? 'bg-success-light text-success'
                          : 'bg-warning-light text-warning'
                      }`}
                    >
                      {org.status === 'active' ? 'Activa' : 'Pendiente'}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white">
          <div className="border-b border-neutral-100 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Actividad Reciente</h2>
            <p className="text-sm text-neutral-500">Actividad de la plataforma en tiempo real</p>
          </div>
          <div className="divide-y divide-neutral-100">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      activity.type === 'org'
                        ? 'bg-primary-light'
                        : activity.type === 'adoption'
                          ? 'bg-success-light'
                          : activity.type === 'user'
                            ? 'bg-info-light'
                            : activity.type === 'approved'
                              ? 'bg-primary-highlight-muted'
                              : 'bg-secondary-highlight-light'
                    }`}
                  >
                    {activity.type === 'org' && (
                      <Building2 className="h-4 w-4 text-primary-brand" />
                    )}
                    {activity.type === 'adoption' && <Heart className="h-4 w-4 text-success" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-info" />}
                    {activity.type === 'approved' && (
                      <PawPrint className="h-4 w-4 text-primary-highlight" />
                    )}
                    {activity.type === 'pet' && (
                      <PawPrint className="h-4 w-4 text-secondary-highlight" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">{activity.action}</p>
                    <p className="text-xs font-medium text-neutral-900">{activity.org}</p>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 p-4">
            <Button variant="ghost" className="w-full text-sm">
              Ver toda la actividad
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200/50 bg-linear-to-br from-primary-light to-primary-highlight-light/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-dark">Aprobaciones Pendientes</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-brand text-xs font-bold text-white">
              5
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-primary-dark">5 orgs</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-brand/20">
            <div className="animate-progress h-full w-3/4 rounded-full bg-gradient-brand" />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200/50 bg-linear-to-br from-success-light/30 to-success/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-success">Adopciones Hoy</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold text-success-dark">12</p>
          <p className="mt-1 text-xs text-success">+3 respecto a ayer</p>
        </div>

        <div className="rounded-xl border border-neutral-200/50 bg-linear-to-br from-secondary-highlight-light/50 to-secondary-highlight/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-highlight-dark">
              Nuevos Usuarios (7d)
            </span>
            <Users className="h-4 w-4 text-secondary-highlight-dark" />
          </div>
          <p className="mt-2 text-2xl font-bold text-secondary-highlight-dark">234</p>
          <p className="mt-1 text-xs text-secondary-highlight-dark">+18% semana a semana</p>
        </div>

        <div className="rounded-xl border border-neutral-200/50 bg-linear-to-br from-tertiary-highlight-light/50 to-tertiary-highlight/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-tertiary-highlight-dark">
              Sesiones Activas
            </span>
            <Activity className="h-4 w-4 text-tertiary-highlight-dark" />
          </div>
          <p className="mt-2 text-2xl font-bold text-tertiary-highlight-dark">1,847</p>
          <p className="mt-1 text-xs text-tertiary-highlight-dark">Usuarios en tiempo real</p>
        </div>
      </div>
    </div>
  );
}
