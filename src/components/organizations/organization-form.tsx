'use client';

import { typeboxResolver } from '@hookform/resolvers/typebox';
import { type Static, Type } from '@sinclair/typebox';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const common = useTranslations('Common');
  const t = useTranslations('Organizations');
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
        toast.success(t('updated'));
      } else {
        await createOrganization(data);
        toast.success(t('created'));
      }
      router.push('/admin/organizations');
    } catch {
      toast.error(t('saveError'));
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
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('namePlaceholder')} {...field} />
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
              <FormLabel>{t('slug')}</FormLabel>
              <FormControl>
                <Input placeholder={t('slugPlaceholder')} {...field} />
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
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('descriptionPlaceholder')} {...field} />
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
              <FormLabel>{t('logoUrl')}</FormLabel>
              <FormControl>
                <Input placeholder={t('logoUrlPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? t('saving')
              : isEditing
                ? t('updateSubmit')
                : t('createSubmit')}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {common('cancel')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
