'use server';

import {
    and,
    count,
    desc,
    eq,
    ilike,
    or,
    sql,
    type SQL
} from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { citiesTable, organizationsTable, petsTable, usersTable } from '@/db/schema';
import type { PaginatedResult, QueryOptions } from '@/lib/types';
import { PetFilters } from '@/lib/pets';
import { createClient } from '@/lib/supabase/server';

export type Pet = Omit<typeof petsTable.$inferSelect, 'image' | 'description' | 'temperament' | 'breed' | 'color'> & {
    cityName: string;
    organizationName: string;
    image: string;
    description: string;
    temperament: string;
    breed: string;
    color: string;
};

export type NewPet = typeof petsTable.$inferInsert;

// Helper to build the base selection with joins
function getBaseSelection() {
    return {
        id: petsTable.id,
        organizationId: petsTable.organizationId,
        cityId: petsTable.cityId,
        name: petsTable.name,
        species: petsTable.species,
        breed: petsTable.breed,
        birthDate: petsTable.birthDate,
        sex: petsTable.sex,
        size: petsTable.size,
        color: petsTable.color,
        description: petsTable.description,
        temperament: petsTable.temperament,
        status: petsTable.status,
        origin: petsTable.origin,
        image: petsTable.image,
        createdBy: petsTable.createdBy,
        updatedBy: petsTable.updatedBy,
        createdAt: petsTable.createdAt,
        updatedAt: petsTable.updatedAt,
        cityName: citiesTable.name,
        organizationName: organizationsTable.name,
    };
}

export async function getPets(
    options?: QueryOptions<PetFilters>
): Promise<PaginatedResult<Pet>> {
    const page = options?.page ?? 1;
    const pageSize = options?.limit ?? 10;
    const { search, species, sex, size, status, cityId, organizationId } = options?.filters ?? {};

    const whereConditions: SQL[] = [];

    // Always filter only active pets if no status is specified (or based on caller's intent?)
    // The memory repo filtered active by default unless specified.
    if (status) {
        whereConditions.push(eq(petsTable.status, status));
    }

    if (species) whereConditions.push(eq(petsTable.species, species));
    if (sex) whereConditions.push(eq(petsTable.sex, sex));
    if (size) whereConditions.push(eq(petsTable.size, size));
    if (cityId) whereConditions.push(eq(petsTable.cityId, cityId));
    if (organizationId) whereConditions.push(eq(petsTable.organizationId, organizationId));

    if (search) {
        const searchLower = `%${search.toLowerCase()}%`;
        whereConditions.push(
            or(
                ilike(petsTable.name, searchLower),
                ilike(petsTable.breed, searchLower),
                ilike(petsTable.description, searchLower),
                ilike(citiesTable.name, searchLower)
            ) as SQL
        );
    }

    const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Count query
    const [totalResult] = await db
        .select({ count: count() })
        .from(petsTable)
        .leftJoin(citiesTable, eq(petsTable.cityId, citiesTable.id))
        .where(where);

    const total = totalResult?.count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    // Data query
    const data = await db
        .select(getBaseSelection())
        .from(petsTable)
        .leftJoin(citiesTable, eq(petsTable.cityId, citiesTable.id))
        .innerJoin(organizationsTable, eq(petsTable.organizationId, organizationsTable.id))
        .where(where)
        .orderBy(desc(petsTable.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

    // Cast keys to allow nullable City to be just string (as per left join logic it might be null, but we expect cityId reference to be valid usually)
    const mappedData = data.map(d => ({
        ...d,
        cityName: d.cityName ?? 'Desconocida',
        image: d.image ?? '/images/pet-placeholder.jpg',
        description: d.description ?? '',
        temperament: d.temperament ?? '',
        breed: d.breed ?? 'Mestizo',
        color: d.color ?? 'Varios',
    }));

    return {
        data: mappedData,
        pagination: {
            page,
            limit: pageSize,
            total,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
        },
    };
}

export async function getPet(id: string): Promise<Pet | null> {
    const [pet] = await db
        .select(getBaseSelection())
        .from(petsTable)
        .leftJoin(citiesTable, eq(petsTable.cityId, citiesTable.id))
        .innerJoin(organizationsTable, eq(petsTable.organizationId, organizationsTable.id))
        .where(eq(petsTable.id, id));

    if (!pet) return null;

    return {
        ...pet,
        cityName: pet.cityName ?? 'Desconocida',
        image: pet.image ?? '/images/pet-placeholder.jpg',
        description: pet.description ?? '',
        temperament: pet.temperament ?? '',
        breed: pet.breed ?? 'Mestizo',
        color: pet.color ?? 'Varios',
    };
}

export async function getRandomPets(count: number, filters?: PetFilters): Promise<Pet[]> {
    const whereConditions: SQL[] = [];

    // Default to active only for random pets
    whereConditions.push(eq(petsTable.status, 'active'));

    if (filters?.species) whereConditions.push(eq(petsTable.species, filters.species));
    if (filters?.sex) whereConditions.push(eq(petsTable.sex, filters.sex));
    if (filters?.size) whereConditions.push(eq(petsTable.size, filters.size));
    if (filters?.cityId) whereConditions.push(eq(petsTable.cityId, filters.cityId));
    if (filters?.organizationId) whereConditions.push(eq(petsTable.organizationId, filters.organizationId));

    const where = and(...whereConditions);

    const data = await db
        .select(getBaseSelection())
        .from(petsTable)
        .leftJoin(citiesTable, eq(petsTable.cityId, citiesTable.id))
        .innerJoin(organizationsTable, eq(petsTable.organizationId, organizationsTable.id))
        .where(where)
        .orderBy(sql`RANDOM()`)
        .limit(count);

    return data.map(d => ({
        ...d,
        cityName: d.cityName ?? 'Desconocida',
        image: d.image ?? '/images/pet-placeholder.jpg',
        description: d.description ?? '',
        temperament: d.temperament ?? '',
        breed: d.breed ?? 'Mestizo',
        color: d.color ?? 'Varios',
    }));
}

export async function createPet(data: NewPet) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const [pet] = await db
        .insert(petsTable)
        .values({
            ...data,
            id: uuidv4(),
            createdBy: user.id,
            updatedBy: user.id,
            // Ensure nulls for optionals
            breed: data.breed ?? null,
            color: data.color ?? null,
            description: data.description ?? null,
            temperament: data.temperament ?? null,
            image: data.image ?? null,
        })
        .returning();

    revalidatePath('/pets');
    revalidatePath('/admin/dashboard');

    return pet;
}

export async function updatePet(id: string, data: Partial<NewPet>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const [pet] = await db
        .update(petsTable)
        .set({
            ...data,
            updatedBy: user.id,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(petsTable.id, id))
        .returning();

    revalidatePath('/pets');
    revalidatePath(`/pets/${id}`);

    return pet ?? null;
}

export async function deletePet(id: string) {
    // Hard delete or soft? Memory repo did hard delete (splice).
    // But usage of status='deceased' etc suggests we might want to keep history.
    // For now let's implement hard delete to match repo, or maybe check if we want soft delete.
    // The 'delete' method in repo did splice.

    await db.delete(petsTable).where(eq(petsTable.id, id));
    revalidatePath('/pets');
}

export async function getAvailableCities() {
    const result = await db
        .select({
            id: citiesTable.id,
            name: citiesTable.name,
            count: count(petsTable.id),
        })
        .from(petsTable)
        .innerJoin(citiesTable, eq(petsTable.cityId, citiesTable.id))
        .where(eq(petsTable.status, 'active'))
        .groupBy(citiesTable.id, citiesTable.name)
        .orderBy(desc(count(petsTable.id)));

    return result;
}

export async function getCountsBySpecies() {
    const result = await db
        .select({
            species: petsTable.species,
            count: count(petsTable.id),
        })
        .from(petsTable)
        .where(eq(petsTable.status, 'active'))
        .groupBy(petsTable.species);

    const counts: Record<string, number> = { dog: 0, cat: 0 };
    result.forEach(row => {
        counts[row.species] = row.count;
    });

    return counts;
}

export async function getPetsCount() {
    const [result] = await db.select({ count: count() }).from(petsTable);
    return result?.count ?? 0;
}
