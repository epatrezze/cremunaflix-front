import type { Film, FilmStatus, Session, Request, PaginatedResponse } from '../../contracts';

export interface CatalogQuery {
  query?: string;
  genre?: string;
  year?: number;
  status?: FilmStatus;
  page?: number;
  pageSize?: number;
}

export interface RequestListQuery {
  sort?: 'newest' | 'oldest';
  page?: number;
  pageSize?: number;
}

export interface PastSessionsQuery {
  from?: string;
  to?: string;
}

export interface CreateRequestPayload {
  title: string;
  link: string;
  reason: string;
}

export interface ApiClient {
  getCatalog: (query?: CatalogQuery) => Promise<PaginatedResponse<Film>>;
  getFilm: (id: string) => Promise<Film>;
  getUpcomingSessions: () => Promise<Session[]>;
  getPastSessions: (query?: PastSessionsQuery) => Promise<Session[]>;
  listRequests: (query?: RequestListQuery) => Promise<PaginatedResponse<Request>>;
  createRequest: (payload: CreateRequestPayload) => Promise<Request>;
}
