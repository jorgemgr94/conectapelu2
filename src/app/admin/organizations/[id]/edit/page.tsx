import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganization } from '@/app/actions/organizations';
import { OrganizationForm } from '@/components/organizations/organization-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organization = await getOrganization(id);

  if (!organization) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/organizations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Organization</h1>
          <p className="text-sm text-slate-500">Update details for {organization.name}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <OrganizationForm organization={organization} />
        </CardContent>
      </Card>
    </div>
  );
}
