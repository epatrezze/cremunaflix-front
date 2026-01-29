export interface PageInfoDTO {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
}

export interface PagedResponseDTO<T> {
  items: T[];
  pageInfo: PageInfoDTO;
}

export interface PaginatedResponseDTO<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
