import {
  Calendar,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  User,
  UserCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import {
  getOrganizationBySlug,
  getOrganizationMembersBySlug,
} from '@/app/actions/organization-members';
import { Button } from '@/components/ui/button';

interface MembersPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; role?: string }>;
}

export default async function MembersPage({ params, searchParams }: MembersPageProps) {
  const { slug } = await params;
  const { search, role } = await searchParams;
  const [common, t, format] = await Promise.all([
    getTranslations('Common'),
    getTranslations('OrgMembers'),
    getFormatter(),
  ]);

  const organization = await getOrganizationBySlug(slug);
  let members = await getOrganizationMembersBySlug(slug);

  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase();
    members = members.filter(
      (member) =>
        member.user?.email?.toLowerCase().includes(searchLower) ||
        member.user?.firstName?.toLowerCase().includes(searchLower) ||
        member.user?.lastName?.toLowerCase().includes(searchLower),
    );
  }

  if (role) {
    members = members.filter((member) => member.role === role);
  }

  const roleCounts = {
    all: members.length,
    org_admin: members.filter((m) => m.role === 'org_admin').length,
    reviewer: members.filter((m) => m.role === 'reviewer').length,
    member: members.filter((m) => m.role === 'member').length,
  };

  const getRoleStyle = (memberRole: string) => {
    switch (memberRole) {
      case 'org_admin':
        return 'bg-purple-100 text-purple-700';
      case 'reviewer':
        return 'bg-amber-100 text-amber-700';
      case 'member':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleLabel = (memberRole: string) => {
    switch (memberRole) {
      case 'org_admin':
        return t('admin');
      case 'reviewer':
        return t('reviewer');
      case 'member':
        return t('memberRole');
      default:
        return memberRole;
    }
  };

  const getRoleIcon = (memberRole: string) => {
    switch (memberRole) {
      case 'org_admin':
        return Shield;
      case 'reviewer':
        return UserCog;
      default:
        return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <p className="text-sm text-slate-500">
              {t('organizationSubtitle', {
                organization: organization?.name || common('organization'),
              })}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600"
        >
          <Link href={`/org/${slug}/members/invite`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('invite')}
          </Link>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/50 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <form>
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder={t('searchPlaceholder')}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              />
            </form>
          </div>

          {/* Role Filter Pills */}
          <div className="hidden items-center gap-2 lg:flex">
            {[
              { value: '', label: common('all'), count: roleCounts.all },
              { value: 'org_admin', label: t('admins'), count: roleCounts.org_admin },
              { value: 'reviewer', label: t('reviewers'), count: roleCounts.reviewer },
              { value: 'member', label: t('membersPlural'), count: roleCounts.member },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/org/${slug}/members${option.value ? `?role=${option.value}` : ''}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  role === option.value || (!role && option.value === '')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    role === option.value || (!role && option.value === '')
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {option.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Filter */}
        <Button variant="outline" className="gap-2 lg:hidden">
          <Filter className="h-4 w-4" />
          {t('filter')}
        </Button>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">{t('empty')}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {search || role ? t('adjustFilters') : t('none')}
          </p>
          {!search && !role && (
            <Button asChild className="mt-4" variant="outline">
              <Link href={`/org/${slug}/members/invite`}>
                <Plus className="mr-2 h-4 w-4" />
                {t('invite')}
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <div
                key={member.id}
                className="card-hover group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Role Badge */}
                <div className="absolute right-4 top-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getRoleStyle(member.role)}`}
                  >
                    <RoleIcon className="h-3 w-3" />
                    {getRoleLabel(member.role)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-110">
                      {member.user?.firstName?.charAt(0) ||
                        member.user?.email?.charAt(0).toUpperCase() ||
                        'U'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div className="flex-1 overflow-hidden pt-1">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {member.user?.firstName && member.user?.lastName
                        ? `${member.user.firstName} ${member.user.lastName}`
                        : member.user?.email?.split('@')[0] || t('unknown')}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{member.user?.email || common('noEmail')}</span>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {t('joinedOn', {
                        date: format.dateTime(new Date(member.createdAt), {
                          dateStyle: 'medium',
                        }),
                      })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
