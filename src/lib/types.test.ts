import { describe, expect, it } from 'vitest';

import {
  buildPaginationMeta,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  normalizePagination,
} from './types';

describe('pagination helpers', () => {
  describe('normalizePagination', () => {
    it('uses defaults when options are absent', () => {
      expect(normalizePagination()).toEqual({
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
      });
    });

    it('clamps invalid page and limit values', () => {
      expect(normalizePagination({ page: -5, limit: MAX_LIMIT + 1 })).toEqual({
        page: 1,
        limit: MAX_LIMIT,
      });
    });
  });

  describe('buildPaginationMeta', () => {
    it('calculates navigation metadata', () => {
      expect(buildPaginationMeta(21, { page: 2, limit: 10 })).toEqual({
        page: 2,
        limit: 10,
        total: 21,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('handles an empty result', () => {
      expect(buildPaginationMeta(0, { page: 1, limit: 10 })).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    });
  });
});
