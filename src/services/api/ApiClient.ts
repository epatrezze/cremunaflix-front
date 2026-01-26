import type {
  FilmStatus,
  Movie,
  MovieStatus,
  Session,
  Request,
  PaginatedResponse
} from '../../contracts';

export type CatalogStatusFilter = FilmStatus | MovieStatus;

export interface CatalogQuery {
  query?: string;
  genre?: string;
  year?: number;
  status?: CatalogStatusFilter;
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
  getCatalog: (query?: CatalogQuery) => Promise<PaginatedResponse<Movie>>;
  getFilmById: (id: string) => Promise<Movie>;
  getUpcomingSessions: () => Promise<Session[]>;
  getPastSessions: (query?: PastSessionsQuery) => Promise<Session[]>;
  listRequests: (query?: RequestListQuery) => Promise<PaginatedResponse<Request>>;
  createRequest: (payload: CreateRequestPayload) => Promise<Request>;
}
