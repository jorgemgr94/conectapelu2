import {
  ArrowLeft,
  Calendar,
  Cat,
  Dog,
  Heart,
  MapPin,
  PawPrint,
  Ruler,
  Share2,
  Sparkles,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicFooter, PublicHeader } from '@/components/public';
import { Button } from '@/components/ui/button';
import { calculatePetAge, getSexLabel, getSizeLabel, getSpeciesLabel } from '@/domain/pets';
import { getPetRepository } from '@/infrastructure/persistence';

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repository = getPetRepository();
  const pet = await repository.findById(id);

  if (!pet) {
    notFound();
  }

  const similarPets = await repository.getRandomPets(4, { species: pet.species });
  const filteredSimilarPets = similarPets.filter((p) => p.id !== pet.id).slice(0, 3);

  const petAge = calculatePetAge(pet.birthDate);

  const infoCards = [
    { icon: Calendar, label: 'Edad', value: petAge },
    { icon: Ruler, label: 'Tamaño', value: getSizeLabel(pet.size) },
    { icon: User, label: 'Sexo', value: getSexLabel(pet.sex) },
    { icon: MapPin, label: 'Ubicación', value: pet.cityName },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark-page">
      <PublicHeader />

      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a peludos
        </Link>
      </div>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src={pet.image}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-dark-base/60 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    {pet.species === 'dog' ? (
                      <Dog className="h-4 w-4" />
                    ) : (
                      <Cat className="h-4 w-4" />
                    )}
                    {getSpeciesLabel(pet.species)}
                  </span>
                </div>

                <div className="absolute right-4 top-4 flex gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-error hover:text-white"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`relative aspect-square overflow-hidden rounded-xl border ${
                      i === 1 ? 'border-primary-highlight/50' : 'border-white/10'
                    } bg-white/5`}
                  >
                    <Image
                      src={pet.image}
                      alt={`${pet.name} - foto ${i}`}
                      fill
                      className="object-cover opacity-80"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white lg:text-5xl">{pet.name}</h1>
                    <p className="mt-2 text-lg text-neutral-400">{pet.breed}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white">
                    <PawPrint className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">En adopción con</p>
                    <p className="font-medium text-white">{pet.organizationName}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {infoCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <card.icon className="mx-auto h-5 w-5 text-primary-highlight" />
                    <p className="mt-2 text-sm text-neutral-500">{card.label}</p>
                    <p className="font-semibold text-white">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Sobre {pet.name}</h2>
                <p className="leading-relaxed text-neutral-400">{pet.description}</p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Personalidad</h2>
                <div className="flex flex-wrap gap-2">
                  {pet.temperament.split(',').map((trait) => (
                    <span
                      key={trait}
                      className="rounded-full bg-primary-highlight/10 px-4 py-1.5 text-sm font-medium text-primary-highlight"
                    >
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Color</p>
                    <p className="font-medium text-white">{pet.color}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">ID</p>
                    <p className="font-medium text-white">{pet.id}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="flex-1 bg-gradient-brand text-white hover:opacity-90"
                >
                  <Link href={`/user?action=adopt&petId=${pet.id}`}>
                    <Heart className="mr-2 h-5 w-5" />
                    Quiero Adoptar
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="flex-1 border-tertiary-highlight/30 bg-tertiary-highlight/10 text-tertiary-highlight hover:bg-tertiary-highlight/20"
                >
                  <Link href={`/user?action=sponsor&petId=${pet.id}`}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Apadrinar
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  Verificado
                </span>
                <span>•</span>
                <span>Vacunado</span>
                <span>•</span>
                <span>Esterilizado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {filteredSimilarPets.length > 0 && (
        <section className="border-t border-white/5 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Otros {pet.species === 'dog' ? 'perritos' : 'gatitos'} que te pueden gustar
              </h2>
              <Link
                href={`/pets?type=${pet.species}`}
                className="text-sm font-medium text-primary-highlight hover:text-primary-highlight-light"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSimilarPets.map((similarPet) => (
                <Link
                  key={similarPet.id}
                  href={`/pets/${similarPet.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-all hover:border-primary-highlight/30 hover:bg-white/[0.05]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={similarPet.image}
                      alt={similarPet.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-dark-base/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white">{similarPet.name}</h3>
                      <p className="text-sm text-neutral-300">
                        {similarPet.breed} · {calculatePetAge(similarPet.birthDate)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
}
