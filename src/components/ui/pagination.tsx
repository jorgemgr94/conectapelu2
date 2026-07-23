'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  baseUrl: string;
  /** Total number of items (for "Showing X to Y of Z" text) */
  total?: number;
  /** Items per page (for "Showing X to Y of Z" text) */
  limit?: number;
  /** Label for items (e.g., "organizaciones", "usuarios") */
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  baseUrl,
  total,
  limit,
  itemLabel,
}: PaginationProps) {
  const t = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  const showPages = 5;
  const halfShow = Math.floor(showPages / 2);

  let startPage = Math.max(1, currentPage - halfShow);
  let endPage = Math.min(totalPages, currentPage + halfShow);

  if (currentPage - halfShow < 1) {
    endPage = Math.min(totalPages, endPage + (halfShow - currentPage + 1));
  }
  if (currentPage + halfShow > totalPages) {
    startPage = Math.max(1, startPage - (currentPage + halfShow - totalPages));
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push('ellipsis-start');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push('ellipsis-end');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('previous')}
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page) =>
          page === 'ellipsis-start' || page === 'ellipsis-end' ? (
            <span key={page} className="px-2 text-neutral-400">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => router.push(createPageUrl(page))}
              className={`min-w-[40px] ${
                page === currentPage ? 'bg-primary-brand text-white hover:bg-primary-dark' : ''
              }`}
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        className="gap-1"
      >
        {t('next')}
        <ChevronRight className="h-4 w-4" />
      </Button>

      {total !== undefined && limit !== undefined && (
        <p className="ml-4 text-sm text-neutral-500">
          {t('showing', {
            from: (currentPage - 1) * limit + 1,
            to: Math.min(currentPage * limit, total),
            total,
            items: itemLabel ?? t('items'),
          })}
        </p>
      )}
    </div>
  );
}
