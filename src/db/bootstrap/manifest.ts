import { randomBytes } from 'node:crypto';
import { z } from 'zod';

export const bootstrapEnvironmentSchema = z.object({
  BOOTSTRAP_OWNER_EMAIL: z.email(),
  BOOTSTRAP_ORGANIZATION_NAME: z.string().trim().min(1).default('Refugio Esperanza'),
  BOOTSTRAP_ORGANIZATION_SLUG: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .default('refugio-esperanza'),
});

export type BootstrapEnvironment = z.infer<typeof bootstrapEnvironmentSchema>;

export type BootstrapAccount = {
  email: string;
  firstName: string;
  lastName: string;
  role: 'app_admin' | 'organization_admin' | 'user';
};

export function buildBootstrapAccounts(ownerEmail: string): BootstrapAccount[] {
  const email = z.email().parse(ownerEmail).toLowerCase();
  const separatorIndex = email.lastIndexOf('@');
  const localPart = email.slice(0, separatorIndex).split('+')[0];
  const domain = email.slice(separatorIndex + 1);

  return [
    {
      email: `${localPart}+admin@${domain}`,
      firstName: 'Admin',
      lastName: 'Plataforma',
      role: 'app_admin',
    },
    {
      email: `${localPart}+org@${domain}`,
      firstName: 'Admin',
      lastName: 'Organización',
      role: 'organization_admin',
    },
    {
      email: `${localPart}+user@${domain}`,
      firstName: 'Usuario',
      lastName: 'Demo',
      role: 'user',
    },
  ];
}

export function generateTemporaryPassword(): string {
  return `${randomBytes(32).toString('base64url')}Aa1!`;
}

export const bootstrapPets = [
  {
    id: 'f0128b86-d695-4f00-9707-bf3d809ae8c2',
    name: 'Bruno',
    species: 'dog',
    breed: 'Mestizo',
    birthDate: '2022-03-15T00:00:00.000Z',
    sex: 'male',
    size: 'medium',
    color: 'Café',
    description: 'Compañero tranquilo y sociable que disfruta los paseos.',
    temperament: 'Tranquilo, sociable',
    status: 'active',
    origin: 'rescue',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80',
  },
  {
    id: '6b34ec69-b63f-49db-b738-7d7bdd76d198',
    name: 'Nala',
    species: 'cat',
    breed: 'Mestiza',
    birthDate: '2023-08-10T00:00:00.000Z',
    sex: 'female',
    size: 'small',
    color: 'Naranja',
    description: 'Gatita curiosa que busca un hogar tranquilo.',
    temperament: 'Curiosa, cariñosa',
    status: 'active',
    origin: 'rescue',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
  },
  {
    id: '582216ff-8762-45e8-a215-fe94c7e86c57',
    name: 'Toby',
    species: 'dog',
    breed: 'Pug',
    birthDate: '2021-11-05T00:00:00.000Z',
    sex: 'male',
    size: 'small',
    color: 'Negro',
    description: 'Perro alegre, adaptable y muy cercano a las personas.',
    temperament: 'Alegre, afectuoso',
    status: 'active',
    origin: 'surrender',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
  },
  {
    id: '5e4ad050-2b20-4af2-9ea8-ebf7c03dd9e7',
    name: 'Willow',
    species: 'cat',
    breed: 'Mestiza',
    birthDate: '2024-01-20T00:00:00.000Z',
    sex: 'female',
    size: 'small',
    color: 'Café',
    description: 'Joven, juguetona y acostumbrada a convivir con otros gatos.',
    temperament: 'Juguetona, sociable',
    status: 'active',
    origin: 'born_in_care',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80',
  },
  {
    id: 'b2118502-f94c-46d7-a75a-11e6f074351f',
    name: 'Jack',
    species: 'dog',
    breed: 'Mestizo',
    birthDate: '2020-06-12T00:00:00.000Z',
    sex: 'male',
    size: 'large',
    color: 'Negro',
    description: 'Caso listo para revisar antes de publicarse.',
    temperament: 'Noble, activo',
    status: 'in_review',
    origin: 'transfer',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  },
  {
    id: 'c903f99d-bfde-46b6-bf72-c51ec2ecfdf7',
    name: 'Milo',
    species: 'cat',
    breed: 'Mestizo',
    birthDate: '2022-09-01T00:00:00.000Z',
    sex: 'male',
    size: 'small',
    color: 'Gris',
    description: 'Historia de adopción completada para mostrar el ciclo de vida.',
    temperament: 'Independiente, tranquilo',
    status: 'adopted',
    origin: 'rescue',
    image: 'https://images.unsplash.com/photo-1495360019602-e0019216774a?w=800&q=80',
  },
] as const;
