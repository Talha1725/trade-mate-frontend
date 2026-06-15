export type TableQueryConfig<T> = {
  /** Full client-side dataset to search/filter/paginate over. */
  rows: T[];
  /** Rows per page. Defaults to 10. */
  pageSize?: number;
  /** Returns the text a row should be matched against for search. */
  searchText?: (row: T) => string;
  /** Returns true if the row passes the currently active filters. */
  filterFn?: (row: T, filters: Record<string, string>) => boolean;
};

export type TableQuery<T> = {
  search: string;
  setSearch: (value: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
  total: number;
  /** The current page of rows after search + filter. */
  rows: T[];
};
