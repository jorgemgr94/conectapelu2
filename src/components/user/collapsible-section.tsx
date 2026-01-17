'use client';

import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  badge?: string | number;
  defaultOpen?: boolean;
  children: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
}

export function CollapsibleSection({
  title,
  icon,
  badge,
  defaultOpen = false,
  children,
  emptyState,
  isEmpty = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-white">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            {badge !== undefined && (
              <p className="text-sm text-neutral-500">
                {badge} {typeof badge === 'number' && badge === 1 ? 'elemento' : 'elementos'}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-neutral-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Content */}
      <div
        className={cn(
          'grid transition-all duration-200',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-neutral-100 px-6 py-4">
            {isEmpty ? emptyState : children}
          </div>
        </div>
      </div>
    </div>
  );
}
