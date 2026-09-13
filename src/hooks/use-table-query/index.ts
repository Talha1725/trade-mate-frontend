"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { TableQuery, TableQueryConfig } from "@/types/table";

/**
 * Centralizes table search + filter + pagination for client-side data.
 *
 * Every table feeds it the full dataset plus how to search/filter a row, and
 * gets back the current page of rows and the pagination controls. This is the
 * single place to change when these endpoints gain real server-side paging:
 * swap the client-side filter/slice below for a fetch that sends
 * `{ page, search, filters }` and returns `{ items, total }`.
 */
export function useTableQuery<T>({
  rows,
  pageSize = 10,
  searchText,
  filterFn,
}: TableQueryConfig<T>): TableQuery<T> {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // A new search term or filter should always send the user back to page 1.
  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (query && searchText && !searchText(row).toLowerCase().includes(query)) {
        return false;
      }
      if (filterFn && !filterFn(row, filters)) {
        return false;
      }
      return true;
    });
  }, [rows, search, filters, searchText, filterFn]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  return {
    search,
    setSearch,
    filters,
    setFilter,
    page: currentPage,
    setPage,
    pageCount,
    total: filtered.length,
    rows: paged,
  };
}
