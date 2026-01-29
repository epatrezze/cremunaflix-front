import { fetchJson, type ApiRequestOptions } from '../http';
import type {
  CreateRequestBodyDTO,
  PaginatedResponseDTO,
  PagedResponseDTO,
  RequestDTO
} from '../types';

export type RequestsQuery = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

export const listRequests = (query: RequestsQuery = {}, options?: ApiRequestOptions) => {
  const params = new URLSearchParams();
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  const suffix = params.toString();
  return fetchJson<PagedResponseDTO<RequestDTO> | PaginatedResponseDTO<RequestDTO>>(
    `/api/v1/requests${suffix ? `?${suffix}` : ''}`,
    {},
    options
  );
};

export const createRequest = (payload: CreateRequestBodyDTO, options?: ApiRequestOptions) =>
  fetchJson<RequestDTO>(
    '/api/v1/requests',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    options
  );
