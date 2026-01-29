import { fetchJson, type ApiRequestOptions } from '../http';
import type { SessionDTO, PagedResponseDTO } from '../types';

export type SessionsQuery = {
  scope?: string;
  page?: number;
  pageSize?: number;
};

export const listSessions = (query: SessionsQuery = {}, options?: ApiRequestOptions) => {
  const params = new URLSearchParams();
  if (query.scope) params.set('scope', query.scope);
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  const suffix = params.toString();
  return fetchJson<PagedResponseDTO<SessionDTO> | SessionDTO[]>(
    `/api/v1/sessions${suffix ? `?${suffix}` : ''}`,
    {},
    options
  );
};
