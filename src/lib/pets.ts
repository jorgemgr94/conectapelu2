export type PetSpecies = 'dog' | 'cat';
export type PetSex = 'male' | 'female' | 'unknown';
export type PetSize = 'small' | 'medium' | 'large' | 'extra_large';
export type PetStatus =
  | 'submitted'
  | 'in_review'
  | 'active'
  | 'reserved'
  | 'adopted'
  | 'returned'
  | 'deceased';
export type PetOrigin = 'rescue' | 'surrender' | 'transfer' | 'born_in_care';

export interface PetFilters {
  species?: PetSpecies;
  sex?: PetSex;
  size?: PetSize;
  status?: PetStatus;
  cityId?: string;
  organizationId?: string;
  search?: string;
}

// Helper to calculate age from birthDate
export function calculatePetAge(birthDate: Date | string | null | undefined): string {
  if (!birthDate) return 'Edad desconocida';
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();
  const years = now.getFullYear() - date.getFullYear();
  const months = now.getMonth() - date.getMonth();

  if (years === 0) {
    if (months <= 1) return '1 mes';
    return `${months} meses`;
  }
  if (years === 1) return '1 año';
  return `${years} años`;
}

// Helper to get display label for species
export function getSpeciesLabel(species: string): string {
  const labels: Record<string, string> = {
    dog: 'Perrito',
    cat: 'Gatito',
  };
  return labels[species] ?? species;
}

// Helper to get display label for size
export function getSizeLabel(size: string): string {
  const labels: Record<string, string> = {
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    extra_large: 'Extra Grande',
  };
  return labels[size] ?? size;
}

// Helper to get display label for sex
export function getSexLabel(sex: string): string {
  const labels: Record<string, string> = {
    male: 'Macho',
    female: 'Hembra',
    unknown: 'Desconocido',
  };
  return labels[sex] ?? sex;
}
