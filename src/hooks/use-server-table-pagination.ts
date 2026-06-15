"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UseServerTablePaginationOptions = {
  defaultPage?: number;
  defaultPageSize?: number;
  pageParam?: string;
  pageSizeParam?: string;
  pageSizeOptions?: number[];
};

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isAllowedPageSize(value: number, allowed?: number[]) {
  if (!allowed?.length) {
    return value > 0;
  }

  return allowed.includes(value);
}

export function useServerTablePagination({
  defaultPage = 1,
  defaultPageSize = 10,
  pageParam = "page",
  pageSizeParam = "limit",
  pageSizeOptions,
}: UseServerTablePaginationOptions = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams.toString(), [searchParams]);

  const getPageFromParams = useCallback(() => {
    return parsePositiveInt(searchParams.get(pageParam), defaultPage);
  }, [defaultPage, pageParam, searchParams]);

  const getPageSizeFromParams = useCallback(() => {
    const parsed = parsePositiveInt(searchParams.get(pageSizeParam), defaultPageSize);
    return isAllowedPageSize(parsed, pageSizeOptions) ? parsed : defaultPageSize;
  }, [defaultPageSize, pageSizeOptions, pageSizeParam, searchParams]);

  const [page, setPageState] = useState(() => getPageFromParams());
  const [pageSize, setPageSizeState] = useState(() => getPageSizeFromParams());

  useEffect(() => {
    const nextPage = getPageFromParams();
    const nextPageSize = getPageSizeFromParams();

    setPageState((current) => (current === nextPage ? current : nextPage));
    setPageSizeState((current) => (current === nextPageSize ? current : nextPageSize));
  }, [getPageFromParams, getPageSizeFromParams, search]);

  useEffect(() => {
    const nextParams = new URLSearchParams(search);

    if (page > defaultPage) {
      nextParams.set(pageParam, String(page));
    } else {
      nextParams.delete(pageParam);
    }

    if (pageSize !== defaultPageSize) {
      nextParams.set(pageSizeParam, String(pageSize));
    } else {
      nextParams.delete(pageSizeParam);
    }

    const nextSearch = nextParams.toString();
    if (nextSearch === search) {
      return;
    }

    const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [defaultPage, defaultPageSize, page, pageSize, pageParam, pageSizeParam, pathname, router, search]);

  const setPage = useCallback((nextPage: number) => {
    setPageState(nextPage);
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(nextPageSize);
  }, []);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
  };
}
