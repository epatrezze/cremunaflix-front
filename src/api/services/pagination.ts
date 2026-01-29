export const clampPage = (page?: number) => {
  if (page === undefined) {
    return undefined;
  }
  return page >= 1 ? page : 1;
};

export const clampPageSize = (pageSize?: number, max = 100) => {
  if (pageSize === undefined) {
    return undefined;
  }
  if (pageSize < 1) {
    return 1;
  }
  return Math.min(pageSize, max);
};

export const normalizePagination = (
  page?: number,
  pageSize?: number,
  defaults?: { page?: number; pageSize?: number }
) => {
  const resolvedPage = page ?? defaults?.page;
  const resolvedPageSize = pageSize ?? defaults?.pageSize;
  return {
    page: clampPage(resolvedPage),
    pageSize: clampPageSize(resolvedPageSize)
  };
};
