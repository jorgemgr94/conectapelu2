import { Heart, PawPrint, ScrollText, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { CollapsibleSection, PetActionModal } from '@/components/user';
import { calculatePetAge, getSpeciesLabel } from '@/domain/pets';
import { getPetRepository } from '@/infrastructure/persistence';
import { createClient } from '@/lib/supabase/server';

export default async function UserDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; petId?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const repository = getPetRepository();

  let modalPet = null;
  if (params.petId) {
    modalPet = await repository.findById(params.petId);
  }

  const adoptedPets: Awaited<ReturnType<typeof repository.getRandomPets>> = [];
  const sponsoredPets = await repository.getRandomPets(2);
  const favoritePets = await repository.getRandomPets(4);
  const requests: Array<{
    id: string;
    petName: string;
    status: string;
    date: string;
  }> = [{ id: '1', petName: 'Luna', status: 'En revisión', date: '2024-01-15' }];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-white">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative">
          <h1 className="text-3xl font-bold">
            ¡Hola, {user?.email?.split('@')[0] || 'Usuario'}! 👋
          </h1>
          <p className="mt-2 text-white/80">
            Bienvenido a tu panel. Aquí puedes ver tus mascotas, apadrinamientos y más.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/pets"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <PawPrint className="h-4 w-4" />
              Explorar Peludos
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
              <p className="text-sm text-neutral-500">Mascotas adoptadas</p>
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
              <p className="text-sm text-neutral-500">Apadrinamientos</p>
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
              <p className="text-sm text-neutral-500">Favoritos</p>
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
              <p className="text-sm text-neutral-500">Solicitudes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <CollapsibleSection
          title="Mis Mascotas"
          icon={<PawPrint className="h-5 w-5" />}
          badge={adoptedPets.length}
          isEmpty={adoptedPets.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <PawPrint className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">Aún no tienes mascotas</h4>
              <p className="mt-1 text-sm text-neutral-500">
                Cuando adoptes una mascota, aparecerá aquí
              </p>
              <Link
                href="/pets"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-brand hover:underline"
              >
                Explorar peludos disponibles →
              </Link>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adoptedPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Apadrinamientos"
          icon={<Sparkles className="h-5 w-5" />}
          badge={sponsoredPets.length}
          isEmpty={sponsoredPets.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <Sparkles className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">Sin apadrinamientos</h4>
              <p className="mt-1 text-sm text-neutral-500">
                Apadrina una mascota para ayudar con sus cuidados
              </p>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsoredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} sponsored />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Favoritos"
          icon={<Heart className="h-5 w-5" />}
          badge={favoritePets.length}
          isEmpty={favoritePets.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <Heart className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">Sin favoritos</h4>
              <p className="mt-1 text-sm text-neutral-500">
                Guarda tus mascotas favoritas para verlas más tarde
              </p>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favoritePets.map((pet) => (
              <PetCard key={pet.id} pet={pet} compact />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Solicitudes"
          icon={<ScrollText className="h-5 w-5" />}
          badge={requests.length}
          isEmpty={requests.length === 0}
          emptyState={
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <ScrollText className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-medium text-neutral-900">Sin solicitudes</h4>
              <p className="mt-1 text-sm text-neutral-500">
                Tus solicitudes de adopción aparecerán aquí
              </p>
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
                  <p className="font-medium text-neutral-900">Solicitud para {request.petName}</p>
                  <p className="text-sm text-neutral-500">{request.date}</p>
                </div>
                <span className="rounded-full bg-warning/20 px-3 py-1 text-sm font-medium text-warning-dark">
                  {request.status}
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
}: {
  pet: Awaited<ReturnType<typeof getPetRepository>>['findById'] extends (
    id: string,
  ) => Promise<infer T>
    ? NonNullable<T>
    : never;
  sponsored?: boolean;
  compact?: boolean;
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
              Apadrinado
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-neutral-900">{pet.name}</h4>
        {!compact && (
          <p className="text-sm text-neutral-500">
            {getSpeciesLabel(pet.species)} · {calculatePetAge(pet.birthDate)}
          </p>
        )}
      </div>
    </Link>
  );
}
