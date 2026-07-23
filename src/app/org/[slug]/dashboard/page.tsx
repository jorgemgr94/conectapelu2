import {
  ArrowUpRight,
  Calendar,
  Clock,
  Heart,
  PawPrint,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getOrganizationBySlug } from '@/app/actions/organization-members';
import { Button } from '@/components/ui/button';

export default async function OrgDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);
  const [common, t, format] = await Promise.all([
    getTranslations('Common'),
    getTranslations('OrgDashboard'),
    getFormatter(),
  ]);

  const stats = [
    {
      name: t('totalPets'),
      value: '24',
      change: t('addedThisWeek', { count: 3 }),
      icon: PawPrint,
      gradient: 'bg-linear-to-br from-secondary-highlight to-secondary-highlight-dark',
      bgGradient: 'from-secondary-highlight/10 to-secondary-highlight/5',
    },
    {
      name: t('adoptions'),
      value: '18',
      change: t('addedThisMonth', { count: 5 }),
      icon: Heart,
      gradient: 'bg-linear-to-br from-error to-error-dark',
      bgGradient: 'from-error/10 to-error/5',
    },
    {
      name: t('members'),
      value: '6',
      change: t('newCount', { count: 1 }),
      icon: Users,
      gradient: 'bg-gradient-brand',
      bgGradient: 'from-primary-brand/10 to-primary-highlight/5',
    },
    {
      name: t('requests'),
      value: '12',
      change: t('pendingCount', { count: 8 }),
      icon: TrendingUp,
      gradient: 'bg-gradient-tertiary',
      bgGradient: 'from-tertiary-highlight/10 to-tertiary-highlight/5',
    },
  ];

  const recentPets = [
    {
      id: 1,
      name: 'Luna',
      type: 'dog',
      breed: 'Golden Retriever',
      status: 'available',
      age: 2,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Max',
      type: 'dog',
      breed: 'Labrador',
      status: 'pending',
      age: 3,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    },
    {
      id: 3,
      name: 'Michi',
      type: 'cat',
      breed: 'Siamés',
      status: 'available',
      age: 1,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Rocky',
      type: 'dog',
      breed: 'Pastor Alemán',
      status: 'adopted',
      age: 4,
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=200&h=200&fit=crop',
    },
  ];

  const pendingApplications = [
    { id: 1, applicant: 'María García', pet: 'Luna', hours: 2, avatar: 'MG' },
    { id: 2, applicant: 'Carlos López', pet: 'Max', hours: 5, avatar: 'CL' },
    { id: 3, applicant: 'Ana Martínez', pet: 'Michi', days: 1, avatar: 'AM' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-dark-page p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-tertiary-highlight/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-brand/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-tertiary-highlight" />
              <span className="text-sm font-medium text-tertiary-highlight">{t('portal')}</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              {organization?.name || t('organizationFallback')}
            </h1>
            <p className="text-neutral-400">{t('subtitle')}</p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <span>
                {format.dateTime(new Date(), {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <Button className="bg-gradient-tertiary text-white hover:opacity-90" asChild>
              <Link href={`/org/${slug}/pets/new`}>
                <Plus className="mr-2 h-4 w-4" />
                {t('addPet')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="card-hover group relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white p-6"
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
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{stat.name}</p>
              <p className="mt-2 text-xs font-medium text-success">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{t('yourPets')}</h2>
                <p className="text-sm text-neutral-500">{t('recentPets')}</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/org/${slug}/pets`}>{t('viewAll')}</Link>
              </Button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {recentPets.map((pet) => (
                <div
                  key={pet.id}
                  className="group flex items-center gap-4 rounded-xl border border-neutral-100 p-4 transition-all hover:border-tertiary-highlight/50 hover:bg-tertiary-highlight/5"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-900">{pet.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          pet.status === 'available'
                            ? 'bg-success-light text-success'
                            : pet.status === 'pending'
                              ? 'bg-warning-light text-warning'
                              : 'bg-primary-light text-primary-brand'
                        }`}
                      >
                        {pet.status === 'available'
                          ? common('status.available')
                          : pet.status === 'pending'
                            ? common('status.pending')
                            : common('status.adopted')}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">{pet.breed}</p>
                    <p className="text-xs text-neutral-400">
                      {pet.type === 'dog' ? common('pet.dog') : common('pet.cat')} ·{' '}
                      {common('pet.year', { count: pet.age })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white">
          <div className="border-b border-neutral-100 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">{t('pendingRequests')}</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-highlight text-xs font-bold text-white">
                {pendingApplications.length}
              </span>
            </div>
            <p className="text-sm text-neutral-500">{t('reviewRequests')}</p>
          </div>
          <div className="divide-y divide-neutral-100">
            {pendingApplications.map((app) => (
              <div key={app.id} className="p-4 transition-colors hover:bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-tertiary text-xs font-bold text-white">
                    {app.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{app.applicant}</p>
                    <p className="text-sm text-neutral-500">
                      {t.rich('wantsToAdopt', {
                        name: app.pet,
                        strong: (chunks) => (
                          <span className="font-medium text-tertiary-highlight-dark">{chunks}</span>
                        ),
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock className="h-3 w-3" />
                    {'hours' in app
                      ? t('hoursAgo', { count: app.hours ?? 0 })
                      : t('daysAgo', { count: app.days ?? 0 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-100 p-4">
            <Button variant="ghost" className="w-full text-sm" asChild>
              <Link href={`/org/${slug}/adoptions`}>{t('viewAllRequests')}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href={`/org/${slug}/pets/new`}
          className="group flex items-center gap-4 rounded-xl border border-neutral-200/50 bg-white p-5 transition-all hover:border-tertiary-highlight/50 hover:shadow-tertiary"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-tertiary transition-transform group-hover:scale-110">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{t('addPet')}</p>
            <p className="text-sm text-neutral-500">{t('listForAdoption')}</p>
          </div>
        </Link>

        <Link
          href={`/org/${slug}/members/invite`}
          className="group flex items-center gap-4 rounded-xl border border-neutral-200/50 bg-white p-5 transition-all hover:border-primary-highlight/50 hover:shadow-brand"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand transition-transform group-hover:scale-110">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{t('inviteMember')}</p>
            <p className="text-sm text-neutral-500">{t('addToTeam')}</p>
          </div>
        </Link>

        <Link
          href={`/org/${slug}/adoptions`}
          className="group flex items-center gap-4 rounded-xl border border-neutral-200/50 bg-white p-5 transition-all hover:border-error/50 hover:shadow-lg hover:shadow-error/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-error to-error-dark transition-transform group-hover:scale-110">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{t('requests')}</p>
            <p className="text-sm text-neutral-500">{t('reviewApplications')}</p>
          </div>
        </Link>

        <Link
          href={`/org/${slug}/settings`}
          className="group flex items-center gap-4 rounded-xl border border-neutral-200/50 bg-white p-5 transition-all hover:border-secondary-highlight/50 hover:shadow-lg hover:shadow-secondary-highlight/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-secondary-highlight to-secondary-highlight-dark transition-transform group-hover:scale-110">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{t('settings')}</p>
            <p className="text-sm text-neutral-500">{t('organizationSettings')}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
