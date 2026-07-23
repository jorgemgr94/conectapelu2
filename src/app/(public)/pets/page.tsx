import {
  Cat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dog,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getAvailableCities, getCountsBySpecies, getPets } from '@/app/actions/pets';
import { PublicFooter, PublicHeader } from '@/components/public';
import { Button } from '@/components/ui/button';
import { getPetAge, type PetFilters, type PetSize, type PetSpecies } from '@/lib/pets';

interface PetsPageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    city?: string;
    size?: string;
    page?: string;
  }>;
}

export default async function PublicPetsPage({ searchParams }: PetsPageProps) {
  const [common, t] = await Promise.all([getTranslations('Common'), getTranslations('Pets')]);
  const params = await searchParams;

  const filters: PetFilters = {};
  if (params.type && ['dog', 'cat'].includes(params.type)) {
    filters.species = params.type as PetSpecies;
  }
  if (params.size && ['small', 'medium', 'large', 'extra_large'].includes(params.size)) {
    filters.size = params.size as PetSize;
  }
  if (params.city) {
    filters.cityId = params.city;
  }
  if (params.search) {
    filters.search = params.search;
  }

  const currentPage = Math.max(1, Number.parseInt(params.page || '1', 10));
  const pageSize = 10;

  const [petsResult, speciesCounts, availableCities] = await Promise.all([
    getPets({ page: currentPage, limit: pageSize, filters }),
    getCountsBySpecies(),
    getAvailableCities(),
  ]);

  const { data: pets, pagination } = petsResult;

  const petTypes = [
    { name: t('all'), icon: Heart, value: '', count: speciesCounts.dog + speciesCounts.cat },
    { name: t('dogs'), icon: Dog, value: 'dog', count: speciesCounts.dog },
    { name: t('cats'), icon: Cat, value: 'cat', count: speciesCounts.cat },
  ];

  const sizeFilters: Array<{ label: string; value: PetSize }> = [
    { label: common('pet.small'), value: 'small' },
    { label: common('pet.medium'), value: 'medium' },
    { label: common('pet.large'), value: 'large' },
    { label: common('pet.extraLarge'), value: 'extra_large' },
  ];

  const formatAge = (birthDate: Date | string | null | undefined) => {
    const age = getPetAge(birthDate);
    if (!age) return common('pet.unknownAge');
    return age.unit === 'month'
      ? common('pet.month', { count: age.count })
      : common('pet.year', { count: age.count });
  };

  const getSpeciesLabel = (species: string) =>
    species === 'dog' ? common('pet.dog') : common('pet.cat');
  const getSexLabel = (sex: string) =>
    sex === 'male'
      ? common('pet.male')
      : sex === 'female'
        ? common('pet.female')
        : common('pet.unknownSex');
  const getSizeLabel = (size: string) => {
    const sizeKeys = {
      small: 'pet.small',
      medium: 'pet.medium',
      large: 'pet.large',
      extra_large: 'pet.extraLarge',
    } as const;
    return common(sizeKeys[size as keyof typeof sizeKeys] ?? 'pet.unknownAge');
  };

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    if (params.search && !('search' in updates)) newParams.set('search', params.search);
    if (params.type && !('type' in updates)) newParams.set('type', params.type);
    if (params.city && !('city' in updates)) newParams.set('city', params.city);
    if (params.size && !('size' in updates)) newParams.set('size', params.size);
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        newParams.set(key, value);
      }
    }
    const queryString = newParams.toString();
    return queryString ? `/pets?${queryString}` : '/pets';
  };

  return (
    <div className="min-h-screen bg-gradient-dark-page">
      <PublicHeader />

      <section className="border-b border-white/5 bg-dark-base/50 py-6">
        <div className="mx-auto max-w-[1400px] px-6">
          <form action="/pets" method="GET" className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                name="search"
                defaultValue={params.search}
                placeholder={t('searchPlaceholder')}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-highlight/50"
              />
            </div>
            <div className="relative sm:w-48">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <select
                name="city"
                defaultValue={params.city}
                className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/5 pl-12 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-highlight/50"
              >
                <option value="">{t('allCities')}</option>
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name} ({city.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </div>
            {params.type && <input type="hidden" name="type" value={params.type} />}
            {params.size && <input type="hidden" name="size" value={params.size} />}
            <Button
              type="submit"
              className="h-12 bg-gradient-brand px-6 text-white hover:opacity-90"
            >
              <Search className="mr-2 h-4 w-4" />
              {common('search')}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {petTypes.map((type) => {
              const isActive = params.type === type.value || (!params.type && type.value === '');
              return (
                <Link
                  key={type.value}
                  href={buildUrl({ type: type.value || undefined, page: undefined })}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'border border-primary-highlight/30 bg-primary-highlight/20 text-primary-highlight'
                      : 'border border-white/10 text-neutral-400 hover:border-primary-highlight/30 hover:text-white'
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  {type.name}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${isActive ? 'bg-primary-highlight/30' : 'bg-white/10'}`}
                  >
                    {type.count}
                  </span>
                </Link>
              );
            })}

            <div className="mx-2 h-6 w-px bg-white/10" />
            {sizeFilters.map((size) => {
              const isActive = params.size === size.value;
              return (
                <Link
                  key={size.value}
                  href={buildUrl({
                    size: isActive ? undefined : size.value,
                    page: undefined,
                  })}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'border border-tertiary-highlight/30 bg-tertiary-highlight/20 text-tertiary-highlight'
                      : 'border border-white/10 text-neutral-400 hover:border-tertiary-highlight/30 hover:text-white'
                  }`}
                >
                  {size.label}
                </Link>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t('moreFilters')}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-neutral-500">
            <span>{t('found', { count: pagination.total })}</span>
            <span>•</span>
            <span>{t('cities', { count: availableCities.length })}</span>
            {pagination.totalPages > 1 && (
              <>
                <span>•</span>
                <span>
                  {common('pageOf', {
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-[1400px] px-6">
          {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <Search className="h-8 w-8 text-neutral-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{t('emptyTitle')}</h3>
              <p className="mt-1 text-sm text-neutral-500">{t('emptyDescription')}</p>
              <Button
                asChild
                variant="outline"
                className="mt-4 border-white/10 text-white hover:bg-white/5"
              >
                <Link href="/pets">{t('viewAllPets')}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {pets.map((pet, index) => (
                  <Link
                    key={pet.id}
                    href={`/pets/${pet.id}`}
                    className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all hover:border-primary-highlight/30 hover:bg-white/[0.05]"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-dark-base/90 via-dark-base/20 to-transparent" />
                      <button
                        type="button"
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-error hover:text-white"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <div className="absolute left-2 top-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                          {pet.species === 'dog' ? (
                            <Dog className="h-3 w-3" />
                          ) : (
                            <Cat className="h-3 w-3" />
                          )}
                          {getSpeciesLabel(pet.species)}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="truncate text-lg font-bold text-white">{pet.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-neutral-300">
                          <MapPin className="h-3 w-3" />
                          {pet.cityName}
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="mb-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-400">
                          {pet.breed}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-400">
                          {formatAge(pet.birthDate)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-500">
                          {getSexLabel(pet.sex)}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-500">
                          {getSizeLabel(pet.size)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="truncate text-xs text-neutral-500">
                          {pet.organizationName}
                        </span>
                        <span className="whitespace-nowrap text-xs font-medium text-primary-highlight group-hover:text-primary-highlight-light">
                          {t('view')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {pagination.hasPrev ? (
                    <Link
                      href={buildUrl({ page: String(pagination.page - 1) })}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-all hover:border-primary-highlight/30 hover:bg-white/5"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Link>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-neutral-600">
                      <ChevronLeft className="h-5 w-5" />
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      const isActive = pageNum === pagination.page;

                      return (
                        <Link
                          key={pageNum}
                          href={buildUrl({ page: String(pageNum) })}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-brand text-white'
                              : 'border border-white/10 text-neutral-400 hover:border-primary-highlight/30 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  {pagination.hasNext ? (
                    <Link
                      href={buildUrl({ page: String(pagination.page + 1) })}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-all hover:border-primary-highlight/30 hover:bg-white/5"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 text-neutral-600">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
