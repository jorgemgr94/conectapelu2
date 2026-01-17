import {
  buildPaginationMeta,
  normalizePagination,
  type PaginatedResult,
  type QueryOptions,
} from '@/domain/common';
import type {
  CreatePetDTO,
  Pet,
  PetFilters,
  PetOrigin,
  PetRepository,
  PetSex,
  PetSize,
  PetSpecies,
  PetStatus,
  UpdatePetDTO,
} from '@/domain/pets';

// Dog breeds with typical sizes
const dogBreeds: Array<{ breed: string; sizes: PetSize[] }> = [
  { breed: 'Golden Retriever', sizes: ['large'] },
  { breed: 'Labrador', sizes: ['large'] },
  { breed: 'Pastor Alemán', sizes: ['large'] },
  { breed: 'Bulldog Francés', sizes: ['small', 'medium'] },
  { breed: 'Beagle', sizes: ['medium'] },
  { breed: 'Poodle', sizes: ['small', 'medium', 'large'] },
  { breed: 'Chihuahua', sizes: ['small'] },
  { breed: 'Yorkshire Terrier', sizes: ['small'] },
  { breed: 'Boxer', sizes: ['large'] },
  { breed: 'Husky Siberiano', sizes: ['large'] },
  { breed: 'Border Collie', sizes: ['medium', 'large'] },
  { breed: 'Cocker Spaniel', sizes: ['medium'] },
  { breed: 'Dachshund', sizes: ['small'] },
  { breed: 'Shih Tzu', sizes: ['small'] },
  { breed: 'Mestizo', sizes: ['small', 'medium', 'large'] },
  { breed: 'Pitbull', sizes: ['medium', 'large'] },
  { breed: 'Rottweiler', sizes: ['large', 'extra_large'] },
  { breed: 'Schnauzer', sizes: ['small', 'medium'] },
  { breed: 'Jack Russell', sizes: ['small'] },
  { breed: 'Pomerania', sizes: ['small'] },
];

// Cat breeds with typical sizes
const catBreeds: Array<{ breed: string; sizes: PetSize[] }> = [
  { breed: 'Siamés', sizes: ['medium'] },
  { breed: 'Persa', sizes: ['medium', 'large'] },
  { breed: 'Maine Coon', sizes: ['large', 'extra_large'] },
  { breed: 'British Shorthair', sizes: ['medium', 'large'] },
  { breed: 'Ragdoll', sizes: ['large'] },
  { breed: 'Bengalí', sizes: ['medium', 'large'] },
  { breed: 'Abisinio', sizes: ['medium'] },
  { breed: 'Mestizo', sizes: ['small', 'medium', 'large'] },
  { breed: 'Angora', sizes: ['medium'] },
  { breed: 'Sphynx', sizes: ['medium'] },
  { breed: 'Scottish Fold', sizes: ['medium'] },
  { breed: 'Europeo Común', sizes: ['medium', 'large'] },
];

// Cities in Monterrey Metropolitan Area (Nuevo León, México)
const cities = [
  { id: 'monterrey', name: 'Monterrey' },
  { id: 'san-pedro', name: 'San Pedro Garza García' },
  { id: 'san-nicolas', name: 'San Nicolás de los Garza' },
  { id: 'guadalupe', name: 'Guadalupe' },
  { id: 'apodaca', name: 'Apodaca' },
  { id: 'santa-catarina', name: 'Santa Catarina' },
  { id: 'escobedo', name: 'General Escobedo' },
  { id: 'garcia', name: 'García' },
  { id: 'juarez', name: 'Juárez' },
  { id: 'santiago', name: 'Santiago' },
];

// Organizations
const organizations = [
  { id: 'org-1', name: 'Patitas Felices' },
  { id: 'org-2', name: 'Rescatando Huellas' },
  { id: 'org-3', name: 'Amigos Felinos' },
  { id: 'org-4', name: 'Rescate Animal' },
  { id: 'org-5', name: 'Protectora del Norte' },
  { id: 'org-6', name: 'Hogar Peludos' },
  { id: 'org-7', name: 'Segunda Oportunidad' },
  { id: 'org-8', name: 'Adopta un Amigo' },
];

// Pet names
const dogNames = [
  'Luna',
  'Max',
  'Rocky',
  'Bella',
  'Cooper',
  'Daisy',
  'Buddy',
  'Lucy',
  'Duke',
  'Sadie',
  'Charlie',
  'Molly',
  'Bear',
  'Bailey',
  'Tucker',
  'Maggie',
  'Jack',
  'Sophie',
  'Toby',
  'Chloe',
  'Zeus',
  'Zoey',
  'Oscar',
  'Lola',
  'Milo',
  'Nala',
  'Bruno',
  'Coco',
  'Rex',
  'Maya',
  'Thor',
  'Kira',
  'Simba',
  'Nina',
  'Leo',
  'Candy',
  'Nico',
  'Luna',
  'Tyson',
  'Laika',
];

const catNames = [
  'Michi',
  'Bigotes',
  'Oliver',
  'Whiskers',
  'Simba',
  'Nala',
  'Milo',
  'Luna',
  'Leo',
  'Cleo',
  'Felix',
  'Garfield',
  'Salem',
  'Oreo',
  'Shadow',
  'Ginger',
  'Tiger',
  'Smokey',
  'Midnight',
  'Pepper',
  'Tom',
  'Misty',
  'Gato',
  'Minino',
  'Pelusa',
  'Manchas',
  'Tigre',
  'Negro',
  'Blanco',
  'Misha',
];

// Colors
const colors = [
  'Negro',
  'Blanco',
  'Marrón',
  'Dorado',
  'Gris',
  'Naranja',
  'Crema',
  'Atigrado',
  'Bicolor',
  'Tricolor',
  'Manchado',
  'Canela',
];

// Temperaments
const temperaments = [
  'Juguetón y amigable',
  'Tranquilo y cariñoso',
  'Activo y enérgico',
  'Tímido pero dulce',
  'Sociable con otros animales',
  'Protector y leal',
  'Curioso y aventurero',
  'Dormilón y relajado',
  'Inteligente y obediente',
  'Independiente pero afectuoso',
];

// Dog images from Unsplash
const dogImages = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
];

// Cat images from Unsplash
const catImages = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=400&fit=crop',
];

// Utility functions
function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBirthDate(): Date {
  const now = new Date();
  const minAge = 2; // 2 months
  const maxAge = 120; // 10 years in months
  const ageInMonths = Math.floor(Math.random() * (maxAge - minAge)) + minAge;
  const birthDate = new Date(now);
  birthDate.setMonth(birthDate.getMonth() - ageInMonths);
  return birthDate;
}

function generatePet(id: number): Pet {
  const species: PetSpecies = Math.random() > 0.45 ? 'dog' : 'cat'; // Slightly more dogs
  const breedInfo = species === 'dog' ? randomFrom(dogBreeds) : randomFrom(catBreeds);
  const city = randomFrom(cities);
  const org = randomFrom(organizations);
  const now = new Date();

  const pet: Pet = {
    id: `pet-${id.toString().padStart(3, '0')}`,
    organizationId: org.id,
    cityId: city.id,
    name: species === 'dog' ? randomFrom(dogNames) : randomFrom(catNames),
    species,
    breed: breedInfo.breed,
    birthDate: randomBirthDate(),
    sex: randomFrom(['male', 'female', 'unknown'] as PetSex[]),
    size: randomFrom(breedInfo.sizes),
    color: randomFrom(colors),
    description: `${species === 'dog' ? 'Un perrito' : 'Un gatito'} adorable que busca un hogar lleno de amor. ${randomFrom(temperaments)}.`,
    temperament: randomFrom(temperaments),
    status: 'active' as PetStatus, // All are active for display
    origin: randomFrom(['rescue', 'surrender', 'transfer', 'born_in_care'] as PetOrigin[]),
    createdBy: 'system',
    updatedBy: 'system',
    createdAt: now,
    updatedAt: now,
    image: species === 'dog' ? randomFrom(dogImages) : randomFrom(catImages),
    cityName: city.name,
    organizationName: org.name,
  };

  return pet;
}

// Generate 120 pets
const generatedPets: Pet[] = Array.from({ length: 120 }, (_, i) => generatePet(i + 1));

/**
 * In-memory implementation of PetRepository.
 * Used for development and testing before database integration.
 */
export class MemoryPetRepository implements PetRepository {
  private pets: Pet[] = [...generatedPets];

  private applyFilters(pets: Pet[], filters?: PetFilters): Pet[] {
    if (!filters) return pets;

    return pets.filter((pet) => {
      // Only show active pets by default
      if (pet.status !== 'active') return false;

      if (filters.species && pet.species !== filters.species) return false;
      if (filters.sex && pet.sex !== filters.sex) return false;
      if (filters.size && pet.size !== filters.size) return false;
      if (filters.status && pet.status !== filters.status) return false;
      if (filters.cityId && pet.cityId !== filters.cityId) return false;
      if (filters.organizationId && pet.organizationId !== filters.organizationId) return false;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = pet.name.toLowerCase().includes(searchLower);
        const matchesBreed = pet.breed.toLowerCase().includes(searchLower);
        const matchesCity = pet.cityName.toLowerCase().includes(searchLower);
        const matchesDescription = pet.description.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesBreed && !matchesCity && !matchesDescription) return false;
      }

      return true;
    });
  }

  async find(options?: QueryOptions<PetFilters>): Promise<PaginatedResult<Pet>> {
    const filteredPets = this.applyFilters(this.pets, options?.filters);
    const { page, limit } = normalizePagination(options);
    const total = filteredPets.length;
    const offset = (page - 1) * limit;
    const data = filteredPets.slice(offset, offset + limit);

    return {
      data,
      pagination: buildPaginationMeta(total, { page, limit }),
    };
  }

  async getRandomPets(count: number, filters?: PetFilters): Promise<Pet[]> {
    const filteredPets = this.applyFilters(this.pets, filters);
    const shuffled = [...filteredPets].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, 100));
  }

  async findById(id: string): Promise<Pet | null> {
    return this.pets.find((p) => p.id === id) ?? null;
  }

  async create(data: CreatePetDTO): Promise<Pet> {
    const now = new Date();
    const newPet: Pet = {
      id: `pet-${(this.pets.length + 1).toString().padStart(3, '0')}`,
      organizationId: data.organizationId,
      cityId: data.cityId,
      name: data.name,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate,
      sex: data.sex,
      size: data.size,
      color: data.color,
      description: data.description,
      temperament: data.temperament,
      status: data.status ?? 'submitted',
      origin: data.origin,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      createdAt: now,
      updatedAt: now,
      image: data.image,
      cityName: data.cityName,
      organizationName: data.organizationName,
    };
    this.pets.push(newPet);
    return newPet;
  }

  async update(id: string, data: UpdatePetDTO): Promise<Pet | null> {
    const index = this.pets.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: Pet = {
      ...this.pets[index],
      ...data,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    };
    this.pets[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.pets.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.pets.splice(index, 1);
    return true;
  }

  async count(filters?: PetFilters): Promise<number> {
    return this.applyFilters(this.pets, filters).length;
  }

  async getAvailableCities(): Promise<Array<{ id: string; name: string; count: number }>> {
    const activePets = this.pets.filter((p) => p.status === 'active');
    const cityCounts = new Map<string, { name: string; count: number }>();

    for (const pet of activePets) {
      const existing = cityCounts.get(pet.cityId);
      if (existing) {
        existing.count++;
      } else {
        cityCounts.set(pet.cityId, { name: pet.cityName, count: 1 });
      }
    }

    return Array.from(cityCounts.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);
  }

  async getCountsBySpecies(): Promise<Record<string, number>> {
    const activePets = this.pets.filter((p) => p.status === 'active');
    const counts: Record<string, number> = { dog: 0, cat: 0 };

    for (const pet of activePets) {
      counts[pet.species] = (counts[pet.species] || 0) + 1;
    }

    return counts;
  }
}

// Singleton instance for the application
let petRepositoryInstance: MemoryPetRepository | null = null;

export function getPetRepository(): PetRepository {
  if (!petRepositoryInstance) {
    petRepositoryInstance = new MemoryPetRepository();
  }
  return petRepositoryInstance;
}
