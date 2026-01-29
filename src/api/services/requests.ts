import { fetchJson, withQuery, type ApiRequestOptions } from '../http';
import type { PagedResponseDTO, RequestCreateDTO, RequestDTO, RequestSortDTO } from '../../types/dtos';
import { clampPage, clampPageSize } from './pagination';

export type RequestsQuery = {
  page?: number;
  pageSize?: number;
  sort?: RequestSortDTO;
};

export const listRequests = (query: RequestsQuery = {}, options?: ApiRequestOptions) => {
  return fetchJson<PagedResponseDTO<RequestDTO>>(
    withQuery('/requests', {
      sort: query.sort ?? 'requestedAt_desc',
      page: clampPage(query.page),
      pageSize: clampPageSize(query.pageSize)
    }),
    {},
    options
  );
};

export const createRequest = (payload: RequestCreateDTO, options?: ApiRequestOptions) =>
  fetchJson<RequestDTO>(
    '/requests',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    },
    options
  );
