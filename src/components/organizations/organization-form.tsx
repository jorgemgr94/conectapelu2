'use client';

import { typeboxResolver } from '@hookform/resolvers/typebox';
import { type Static, Type } from '@sinclair/typebox';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { Organization } from '@/app/actions/organizations';
import { createOrganization, updateOrganization } from '@/app/actions/organizations';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const formSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  slug: Type.RegExp(/^[a-z0-9-]+$/, { minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  logo: Type.Optional(Type.String()),
});

type FormData = Static<typeof formSchema>;

export function OrganizationForm({ organization }: { organization?: Organization }) {
  const router = useRouter();
  const isEditing = !!organization;

  const form = useForm<FormData>({
    resolver: typeboxResolver(formSchema),
    defaultValues: {
      name: organization?.name ?? '',
      slug: organization?.slug ?? '',
      description: organization?.description ?? '',
      logo: organization?.logo ?? '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      if (isEditing) {
        await updateOrganization(organization.id, data);
        toast.success('Organización actualizada exitosamente');
      } else {
        await createOrganization(data);
        toast.success('Organización creada exitosamente');
      }
      router.push('/admin/organizations');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Algo salió mal');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la organización" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="nombre-organizacion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción de la organización" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Logo</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar Organización'
                : 'Crear Organización'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
