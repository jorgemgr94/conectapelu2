'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginatedResult } from '@/domain/common';
import { createClient } from '@/lib/supabase/client';

interface UseRealtimeCollectionOptions<T> {
  /** Table name to subscribe to */
  table: string;
  /** Initial data from server (SSR) */
  initialData: PaginatedResult<T>;
  /** Function to fetch data with current pagination */
  fetchData: () => Promise<PaginatedResult<T>>;
}

interface UseRealtimeCollectionReturn<T> {
  data: T[];
  pagination: PaginatedResult<T>['pagination'];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for realtime paginated collections.
 *
 * - Uses SSR initial data
 * - Subscribes to Supabase realtime changes
 * - Refetches via server action when changes occur
 *
 * @example
 * ```tsx
 * const { data, pagination } = useRealtimeCollection({
 *   table: 'organizations',
 *   initialData: serverResult,
 *   fetchData: () => getOrganizations({ page, limit }),
 * });
 * ```
 */
export function useRealtimeCollection<T>({
  table,
  initialData,
  fetchData,
}: UseRealtimeCollectionOptions<T>): UseRealtimeCollectionReturn<T> {
  const [result, setResult] = useState<PaginatedResult<T>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchDataRef = useRef(fetchData);

  // Keep fetchData ref updated
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  // Refetch function
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newResult = await fetchDataRef.current();
      setResult(newResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          // Refetch data when any change occurs
          refetch();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, refetch]);

  // Sync with new initialData (for SSR navigation / page changes)
  useEffect(() => {
    setResult(initialData);
  }, [initialData]);

  return {
    data: result.data,
    pagination: result.pagination,
    isLoading,
    error,
    refetch,
  };
}
