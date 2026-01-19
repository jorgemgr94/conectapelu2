import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { citiesTable } from './cities';
import { timestamps } from './common';
import { organizationsTable } from './organizations';
import { usersTable } from './users';

export const petSpeciesEnum = pgEnum('pet_species', ['dog', 'cat']);
export const petSexEnum = pgEnum('pet_sex', ['male', 'female', 'unknown']);
export const petSizeEnum = pgEnum('pet_size', ['small', 'medium', 'large', 'extra_large']);
export const petStatusEnum = pgEnum('pet_status', [
    'submitted',
    'in_review',
    'active',
    'reserved',
    'adopted',
    'returned',
    'deceased',
]);
export const petOriginEnum = pgEnum('pet_origin', ['rescue', 'surrender', 'transfer', 'born_in_care']);

export const petsTable = pgTable('pets', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
        .notNull()
        .references(() => organizationsTable.id),
    cityId: text('city_id').references(() => citiesTable.id),
    name: varchar('name', { length: 100 }).notNull(),
    species: petSpeciesEnum('species').notNull(),
    breed: varchar('breed', { length: 100 }),
    birthDate: timestamp('birth_date', { mode: 'string' }), // Stored as ISO string or timestamp
    sex: petSexEnum('sex').notNull(),
    size: petSizeEnum('size').notNull(),
    color: varchar('color', { length: 50 }),
    description: text('description'),
    temperament: varchar('temperament', { length: 255 }),
    status: petStatusEnum('status').default('submitted').notNull(),
    origin: petOriginEnum('origin').default('rescue').notNull(),
    image: text('image'),

    // Auditing
    createdBy: text('created_by').references(() => usersTable.id),
    updatedBy: text('updated_by').references(() => usersTable.id),
    ...timestamps,
});


export type Pet = typeof petsTable.$inferSelect;
export type NewPet = typeof petsTable.$inferInsert;
