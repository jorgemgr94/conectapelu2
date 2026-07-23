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

export interface PetAge {
  count: number;
  unit: 'month' | 'year';
}

// Helper to calculate age parts from birthDate. Presentation belongs to the i18n layer.
export function getPetAge(birthDate: Date | string | null | undefined): PetAge | null {
  if (!birthDate) return null;
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();
  const years = now.getFullYear() - date.getFullYear();
  const months = now.getMonth() - date.getMonth();

  if (years === 0) {
    return { count: Math.max(1, months), unit: 'month' };
  }
  return { count: years, unit: 'year' };
}
