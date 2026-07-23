import { ArrowRight, Building2, Cat, Dog, Heart, PawPrint, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getPetsCount, getRandomPets } from '@/app/actions/pets';
import { PublicFooter, PublicHeader } from '@/components/public';
import { Button } from '@/components/ui/button';
import { getPetAge } from '@/lib/pets';

export default async function HomePage() {
  const [common, t] = await Promise.all([getTranslations('Common'), getTranslations('Home')]);
  const [featuredPets, totalCount] = await Promise.all([getRandomPets(6), getPetsCount()]);
  const formatAge = (birthDate: Date | string | null | undefined) => {
    const age = getPetAge(birthDate);
    if (!age) return common('pet.unknownAge');
    return age.unit === 'month'
      ? common('pet.month', { count: age.count })
      : common('pet.year', { count: age.count });
  };

  return (
    <div className="min-h-screen bg-gradient-dark-page">
      <PublicHeader />

      <section className="relative overflow-hidden pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary-brand/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-primary-highlight/15 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-4xl font-bold leading-tight text-white lg:text-6xl">
              {t('heroTitle')}{' '}
              <span className="relative">
                <span className="text-primary-highlight">{t('heroHighlight')}</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full text-primary-highlight/40"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5.5C47.6667 2.16667 141.4 -2.2 199 5.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </div>

          <div className="mx-auto mt-10 max-w-7xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {featuredPets.map((pet) => (
                <Link
                  key={pet.id}
                  href={`/pets/${pet.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all hover:border-primary-highlight/30 hover:bg-white/[0.05]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-dark-base/80 via-transparent to-transparent" />
                    <button
                      type="button"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-error hover:text-white"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="font-semibold text-white">{pet.name}</p>
                      <p className="text-xs text-neutral-300">
                        {pet.breed} · {formatAge(pet.birthDate)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/pets?type=dog"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-primary-highlight/50 hover:bg-primary-highlight/10 hover:text-white"
                >
                  <Dog className="h-4 w-4" />
                  {t('dogs')}
                </Link>
                <Link
                  href="/pets?type=cat"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-primary-highlight/50 hover:bg-primary-highlight/10 hover:text-white"
                >
                  <Cat className="h-4 w-4" />
                  {t('cats')}
                </Link>
                <Link
                  href="/pets?size=small"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-primary-highlight/50 hover:bg-primary-highlight/10 hover:text-white"
                >
                  <PawPrint className="h-4 w-4" />
                  {t('small')}
                </Link>
                <Link
                  href="/pets?size=medium"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:border-primary-highlight/50 hover:bg-primary-highlight/10 hover:text-white"
                >
                  <PawPrint className="h-4 w-4" />
                  {t('medium')}
                </Link>
                <Link
                  href="/pets"
                  className="flex items-center gap-2 rounded-full border border-primary-highlight/30 bg-primary-highlight/10 px-5 py-2.5 text-sm font-medium text-primary-highlight transition-all hover:bg-primary-highlight/20 hover:text-white"
                >
                  {t('viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 lg:gap-8">
                <span>{t('availablePets', { count: totalCount })}</span>
                <span className="hidden sm:inline">•</span>
                <span>{t('organizations', { count: 24 })}</span>
                <span className="hidden sm:inline">•</span>
                <span>{t('happyAdoptions', { count: 892 })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-brand/20 px-4 py-2 text-sm font-medium text-primary-highlight mb-4">
                <Heart className="h-4 w-4" />
                {t('mission')}
              </span>
              <h2 className="text-3xl font-bold text-white lg:text-4xl mb-4">{t('why')}</h2>
              <p className="text-neutral-400 mb-4">{t('missionDescription')}</p>
              <p className="text-neutral-400">{t('missionDescriptionTwo')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary-brand/10 p-5 text-center">
                <span className="text-3xl mb-2 block">🐱</span>
                <p className="text-xl font-bold text-white">234</p>
                <p className="text-sm text-neutral-400">{t('cats')}</p>
              </div>
              <div className="rounded-2xl bg-primary-brand/10 p-5 text-center">
                <span className="text-3xl mb-2 block">🐶</span>
                <p className="text-xl font-bold text-white">312</p>
                <p className="text-sm text-neutral-400">{t('dogs')}</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-primary-brand/10 p-5 text-center">
                <span className="text-3xl mb-2 block">💜</span>
                <p className="text-xl font-bold text-white">892</p>
                <p className="text-sm text-neutral-400">{t('loveStories')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 lg:p-16">
            <div className="absolute inset-0 opacity-10">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10">
              <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left lg:gap-12">
                <div className="mb-6 lg:mb-0">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
                    <Image
                      src="/logo.png"
                      alt="ConectaPelu2"
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white/90 mb-4">
                    <Building2 className="h-4 w-4" />
                    {t('forOrganizations')}
                  </span>
                  <h2 className="text-3xl font-bold text-white lg:text-4xl">
                    {t('organizationTitle')}
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 lg:mx-0">
                    {t('organizationDescription')}
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <PawPrint className="h-3 w-3" />
                      </div>
                      {t('petManagement')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <Users className="h-3 w-3" />
                      </div>
                      {t('collaborativeTeam')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <Heart className="h-3 w-3" />
                      </div>
                      {t('adoptionTracking')}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 px-8 bg-white text-primary-brand font-semibold hover:bg-white/90 shadow-xl"
                    >
                      <Link href="/login">
                        {t('registerOrganization')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <span className="text-sm text-white/60">{t('freeAndQuick')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
