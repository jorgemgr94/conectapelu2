'use client';

import { Cat, Dog, Heart, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { Pet } from '@/app/actions/pets';
import { Button } from '@/components/ui/button';
import { getPetAge } from '@/lib/pets';

export function PetActionModal({ pet }: { pet: Pet | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const common = useTranslations('Common');
  const t = useTranslations('PetAction');
  const action = searchParams.get('action');
  const petId = searchParams.get('petId');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (action && petId && pet) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [action, petId, pet]);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/user', { scroll: false });
  };

  if (!isOpen || !pet) return null;

  const isAdopt = action === 'adopt';
  const actionTitle = isAdopt ? t('adoptTitle') : t('sponsorTitle');
  const actionDescription = isAdopt ? t('adoptDescription') : t('sponsorDescription');
  const petAge = getPetAge(pet.birthDate);
  const ageLabel = petAge
    ? petAge.unit === 'month'
      ? common('pet.month', { count: petAge.count })
      : common('pet.year', { count: petAge.count })
    : common('pet.unknownAge');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label={t('close')}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      />

      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          aria-label={t('close')}
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
              isAdopt ? 'bg-gradient-brand' : 'bg-gradient-tertiary'
            } text-white`}
          >
            {isAdopt ? <Heart className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">{actionTitle}</h2>
          <p className="mt-2 text-sm text-neutral-500">{actionDescription}</p>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          <div className="flex gap-4 p-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image src={pet.image} alt={pet.name} fill className="object-cover" unoptimized />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">
                  {pet.species === 'dog' ? (
                    <Dog className="h-3 w-3" />
                  ) : (
                    <Cat className="h-3 w-3" />
                  )}
                  {pet.species === 'dog' ? common('pet.dog') : common('pet.cat')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">{pet.name}</h3>
              <p className="text-sm text-neutral-500">
                {pet.breed} · {ageLabel}
              </p>
              <p className="text-xs text-neutral-400">{pet.organizationName}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
          <p className="text-sm text-neutral-500">
            {t('comingSoon', {
              action: isAdopt ? t('adoption') : t('sponsorship'),
            })}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{t('selectedPetOnly')}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            {common('cancel')}
          </Button>
          <Button
            className={`flex-1 ${isAdopt ? 'bg-gradient-brand' : 'bg-gradient-tertiary'} text-white hover:opacity-90`}
            onClick={handleClose}
          >
            {isAdopt ? t('submitAdoption') : t('confirmSponsorship')}
          </Button>
        </div>
      </div>
    </div>
  );
}
