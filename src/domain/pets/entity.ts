/**
 * Pet Entity - Temporal model for pets/animals in the adoption platform.
 * This will be replaced by a Drizzle schema when connected to the database.
 */

// Enums for pet attributes
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

// Main Pet entity
export interface Pet {
  id: string;
  organizationId: string;
  cityId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: Date;
  sex: PetSex;
  size: PetSize;
  color: string;
  description: string;
  temperament: string;
  status: PetStatus;
  origin: PetOrigin;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  // UI-specific fields (denormalized for display)
  image: string;
  cityName: string;
  organizationName: string;
}

// Domain DTOs
export interface CreatePetData {
  organizationId: string;
  cityId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: Date;
  sex: PetSex;
  size: PetSize;
  color: string;
  description: string;
  temperament: string;
  status?: PetStatus;
  origin: PetOrigin;
  image: string;
  cityName: string;
  organizationName: string;
}

export interface UpdatePetData {
  name?: string;
  species?: PetSpecies;
  breed?: string;
  birthDate?: Date;
  sex?: PetSex;
  size?: PetSize;
  color?: string;
  description?: string;
  temperament?: string;
  status?: PetStatus;
  origin?: PetOrigin;
  image?: string;
  cityName?: string;
  cityId?: string;
}

// Filter options for querying pets
export interface PetFilters {
  species?: PetSpecies;
  sex?: PetSex;
  size?: PetSize;
  status?: PetStatus;
  cityId?: string;
  organizationId?: string;
  search?: string; // Search by name, breed, or description
}

// Helper to calculate age from birthDate
export function calculatePetAge(birthDate: Date): string {
  const now = new Date();
  const years = now.getFullYear() - birthDate.getFullYear();
  const months = now.getMonth() - birthDate.getMonth();

  if (years === 0) {
    if (months <= 1) return '1 mes';
    return `${months} meses`;
  }
  if (years === 1) return '1 año';
  return `${years} años`;
}

// Helper to get display label for species
export function getSpeciesLabel(species: PetSpecies): string {
  const labels: Record<PetSpecies, string> = {
    dog: 'Perrito',
    cat: 'Gatito',
  };
  return labels[species];
}

// Helper to get display label for size
export function getSizeLabel(size: PetSize): string {
  const labels: Record<PetSize, string> = {
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    extra_large: 'Extra Grande',
  };
  return labels[size];
}

// Helper to get display label for sex
export function getSexLabel(sex: PetSex): string {
  const labels: Record<PetSex, string> = {
    male: 'Macho',
    female: 'Hembra',
    unknown: 'Desconocido',
  };
  return labels[sex];
}
