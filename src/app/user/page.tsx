import { Heart, PawPrint, ScrollText, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { getPet, getRandomPets, type Pet } from '@/app/actions/pets';
import { CollapsibleSection, PetActionModal } from '@/components/user';
import { getPetAge } from '@/lib/pets';
import { createClient } from '@/lib/supabase/server';

export default async function UserDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; petId?: string }>;
}) {
  const params = await searchParams;
  const [common, t, format] = await Promise.all([
    getTranslations('Common'),
    getTranslations('UserDashboard'),
    getFormatter(),
  ]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let modalPet = null;
  if (params.petId) {
    modalPet = await getPet(params.petId);
  }

  const adoptedPets: Pet[] = [];
  const sponsoredPets = await getRandomPets(2);
  const favoritePets = await getRandomPets(4);
  const requests: Array<{
    id: string;
    petName: string;
    status: string;
    date: string;
  }> = [{ id: '1', petName: 'Luna', status: 'review', date: '2024-01-15' }];

  const getAgeLabel = (birthDate: Date | string | null) => {
    const age = getPetAge(birthDate);
    if (!age) return common('pet.unknownAge');
    return age.unit === 'month'
      ? common('pet.month', { count: age.count })
      : common('pet.year', { count: age.count });
  };
  const getSpeciesLabel = (species: string) =>
    species === 'dog' ? common('pet.dog') : common('pet.cat');

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative">
          <h1 className="text-3xl font-bold">
            {t('greeting', { name: user?.email?.split('@')[0] || t('userFallback') })}
          </h1>
          <p className="mt-2 text-white/80">{t('welcome')}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/pets"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <PawPrint className="h-4 w-4" />
              {t('explore')}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{adoptedPets.length}</p>
              <p className="text-sm text-neutral-500">{t('adoptedPets')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-tertiary text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{sponsoredPets.length}</p>
              <p className="text-sm text-neutral-500">{t('sponsorships')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-error to-error-dark text-white">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{favoritePets.length}</p>
              <p className="text-sm text-neutral-500">{t('favorites')}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-warning to-warning-dark text-white">
              <ScrollText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{requests.length}</p>
              <p className="text-sm text-neutral-500">{t('requests')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <CollapsibleSection
          title={t('myPets')}
          icon={<PawPrint className="h-5 w-5" />}
          badge={adoptedPets.length}
          isEmpty={adoptedPets.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <PawPrint className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">{t('noPets')}</h4>
              <p className="mt-1 text-sm text-neutral-500">{t('noPetsDescription')}</p>
              <Link
                href="/pets"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-brand hover:underline"
              >
                {t('viewPets')} →
              </Link>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adoptedPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                ageLabel={getAgeLabel(pet.birthDate)}
                speciesLabel={getSpeciesLabel(pet.species)}
                sponsoredLabel={t('sponsored')}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={t('sponsorships')}
          icon={<Sparkles className="h-5 w-5" />}
          badge={sponsoredPets.length}
          isEmpty={sponsoredPets.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <Sparkles className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">{t('noSponsorships')}</h4>
              <p className="mt-1 text-sm text-neutral-500">{t('noSponsorshipsDescription')}</p>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsoredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                sponsored
                ageLabel={getAgeLabel(pet.birthDate)}
                speciesLabel={getSpeciesLabel(pet.species)}
                sponsoredLabel={t('sponsored')}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={t('favorites')}
          icon={<Heart className="h-5 w-5" />}
          badge={favoritePets.length}
          isEmpty={favoritePets.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <Heart className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">{t('noFavorites')}</h4>
              <p className="mt-1 text-sm text-neutral-500">{t('favoritesDescription')}</p>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favoritePets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                compact
                ageLabel={getAgeLabel(pet.birthDate)}
                speciesLabel={getSpeciesLabel(pet.species)}
                sponsoredLabel={t('sponsored')}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={t('requests')}
          icon={<ScrollText className="h-5 w-5" />}
          badge={requests.length}
          isEmpty={requests.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <ScrollText className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">{t('noRequests')}</h4>
              <p className="mt-1 text-sm text-neutral-500">{t('requestsDescription')}</p>
            </div>
          }
        >
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-xl bg-neutral-50 p-4"
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    {t('requestFor', { name: request.petName })}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {format.dateTime(new Date(`${request.date}T00:00:00`), {
                      dateStyle: 'medium',
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-warning/20 px-3 py-1 text-sm font-medium text-warning-dark">
                  {t('reviewStatus')}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      <Suspense fallback={null}>
        <PetActionModal pet={modalPet} />
      </Suspense>
    </div>
  );
}

function PetCard({
  pet,
  sponsored = false,
  compact = false,
  ageLabel,
  speciesLabel,
  sponsoredLabel,
}: {
  pet: Pet;
  sponsored?: boolean;
  compact?: boolean;
  ageLabel: string;
  speciesLabel: string;
  sponsoredLabel: string;
}) {
  if (!pet) return null;

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-primary-highlight/30 hover:shadow-md"
    >
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-[4/3]'} overflow-hidden`}>
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        {sponsored && (
          <div className="absolute left-2 top-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-highlight px-2 py-0.5 text-xs font-medium text-white">
              <Sparkles className="h-3 w-3" />
              {sponsoredLabel}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-neutral-900">{pet.name}</h4>
        {!compact && (
          <p className="text-sm text-neutral-500">
            {speciesLabel} · {ageLabel}
          </p>
        )}
      </div>
    </Link>
  );
}
