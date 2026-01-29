import { fetchJson, withQuery, type ApiRequestOptions } from '../http';
import type { PagedResponseDTO, SessionDTO } from '../../types/dtos';
import { clampPage, clampPageSize } from './pagination';

export type SessionsQuery = {
  scope?: 'upcoming' | 'past';
  page?: number;
  pageSize?: number;
};

export const listSessions = (query: SessionsQuery = {}, options?: ApiRequestOptions) => {
  return fetchJson<PagedResponseDTO<SessionDTO>>(
    withQuery('/sessions', {
      scope: query.scope,
      page: clampPage(query.page),
      pageSize: clampPageSize(query.pageSize)
    }),
    {},
    options
  );
};
