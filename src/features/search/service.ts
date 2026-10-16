import * as repository from './repository';
import type { SearchResponse } from './types';

export async function search(query: string, page = 1, pageSize = 10): Promise<SearchResponse> {
  const trimmed = query.trim();

  if (!trimmed || trimmed.length < 2) {
    return {
      query: trimmed,
      results: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 0
    };
  }

  const allResults = await repository.searchContent(trimmed, 100);

  const total = allResults.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;
  const results = allResults.slice(offset, offset + pageSize);

  return {
    query: trimmed,
    results,
    total,
    page: safePage,
    pageSize,
    totalPages
  };
}