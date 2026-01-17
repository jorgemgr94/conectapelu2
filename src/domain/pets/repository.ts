import type { CrudRepository } from '@/domain/common';
import type { CreatePetData, Pet, PetFilters, UpdatePetData } from './entity';

// Full create DTO including audit fields
export type CreatePetDTO = CreatePetData & {
  createdBy: string;
  updatedBy: string;
};

// Full update DTO including audit fields
export type UpdatePetDTO = UpdatePetData & {
  updatedBy: string;
};

/**
 * Pet Repository interface.
 * Extends base CRUD with pet-specific methods.
 */
export interface PetRepository extends CrudRepository<Pet, CreatePetDTO, UpdatePetDTO, PetFilters> {
  /**
   * Get random pets (for featured sections, recommendations).
   * @param count - Number of random pets to return
   * @param filters - Optional filters to apply before sampling
   */
  getRandomPets(count: number, filters?: PetFilters): Promise<Pet[]>;

  /**
   * Get all unique cities from active pets.
   */
  getAvailableCities(): Promise<Array<{ id: string; name: string; count: number }>>;

  /**
   * Get counts by species.
   */
  getCountsBySpecies(): Promise<Record<string, number>>;
}
