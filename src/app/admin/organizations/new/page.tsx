import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { OrganizationForm } from '@/components/organizations/organization-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NewOrganizationPage() {
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Organización</h1>
          <p className="text-sm text-slate-500">
            Agrega una nueva organización de rescate a la plataforma
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <OrganizationForm />
        </CardContent>
      </Card>
    </div>
  );
}
