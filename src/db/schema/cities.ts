import { numeric, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';

export const citiesTable = pgTable('cities', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
});

export const selectCitySchema = createSelectSchema(citiesTable);
