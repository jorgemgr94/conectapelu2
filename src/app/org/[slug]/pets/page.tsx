import { Eye, Filter, Heart, PawPrint, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';

interface OrgPetsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function OrgPetsPage({ params, searchParams }: OrgPetsPageProps) {
  const { slug } = await params;
  const { search, status } = await searchParams;
  const [common, t] = await Promise.all([getTranslations('Common'), getTranslations('OrgPets')]);

  // Placeholder data with cute images
  let pets = [
    {
      id: '1',
      name: 'Luna',
      type: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
      description: t('demo.luna'),
    },
    {
      id: '2',
      name: 'Max',
      type: 'dog',
      breed: 'Labrador',
      age: 3,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      description: t('demo.max'),
    },
    {
      id: '3',
      name: 'Michi',
      type: 'cat',
      breed: 'Siamese',
      age: 1,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
      description: t('demo.michi'),
    },
    {
      id: '4',
      name: 'Rocky',
      type: 'dog',
      breed: 'German Shepherd',
      age: 4,
      status: 'adopted',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
      description: t('demo.rocky'),
    },
    {
      id: '5',
      name: 'Bella',
      type: 'cat',
      breed: 'Persian',
      age: 2,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
      description: t('demo.bella'),
    },
    {
      id: '6',
      name: 'Cooper',
      type: 'dog',
      breed: 'Beagle',
      age: 1,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop',
      description: t('demo.cooper'),
    },
  ];

  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    pets = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower),
    );
  }

  if (status) {
    pets = pets.filter((pet) => pet.status === status);
  }

  const statusCounts = {
    all: pets.length,
    available: pets.filter((p) => p.status === 'available').length,
    pending: pets.filter((p) => p.status === 'pending').length,
    adopted: pets.filter((p) => p.status === 'adopted').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
            <PawPrint className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <p className="text-sm text-slate-500">{t('subtitle')}</p>
          </div>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600"
        >
          <Link href={`/org/${slug}/pets/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('add')}
          </Link>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/50 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <form>
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder={t('searchPlaceholder')}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
            </form>
          </div>

          {/* Status Filter Pills */}
          <div className="hidden items-center gap-2 lg:flex">
            {[
              { value: '', label: common('all'), count: statusCounts.all },
              {
                value: 'available',
                label: common('status.available'),
                count: statusCounts.available,
              },
              {
                value: 'pending',
                label: common('status.pending'),
                count: statusCounts.pending,
              },
              {
                value: 'adopted',
                label: common('status.adopted'),
                count: statusCounts.adopted,
              },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/org/${slug}/pets${option.value ? `?status=${option.value}` : ''}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  status === option.value || (!status && option.value === '')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    status === option.value || (!status && option.value === '')
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {option.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Filter */}
        <Button variant="outline" className="gap-2 lg:hidden">
          <Filter className="h-4 w-4" />
          {t('filter')}
        </Button>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <PawPrint className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">{t('empty')}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {search || status ? t('adjustFilters') : t('addFirst')}
          </p>
          {!search && !status && (
            <Button asChild className="mt-4" variant="outline">
              <Link href={`/org/${slug}/pets/new`}>
                <Plus className="mr-2 h-4 w-4" />
                {t('add')}
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet, index) => (
            <div
              key={pet.id}
              className="card-hover group overflow-hidden rounded-2xl border border-slate-200/50 bg-white"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={pet.image}
                  alt={pet.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                {/* Status Badge */}
                <div className="absolute left-3 top-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                      pet.status === 'available'
                        ? 'bg-emerald-500/90 text-white'
                        : pet.status === 'pending'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-blue-500/90 text-white'
                    }`}
                  >
                    {common(`status.${pet.status}`)}
                  </span>
                </div>
                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/90 text-slate-700 backdrop-blur-sm hover:bg-white"
                    asChild
                  >
                    <Link href={`/org/${slug}/pets/${pet.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-full bg-rose-500/90 text-white backdrop-blur-sm hover:bg-rose-500"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
                    <p className="text-sm text-slate-500">
                      {pet.breed} · {common('pet.year', { count: pet.age })}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {pet.type === 'dog' ? common('pet.dog') : common('pet.cat')}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-600 line-clamp-2">{pet.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/org/${slug}/pets/${pet.id}/edit`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      {common('edit')}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
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
