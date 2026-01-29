import type {
  ApiClient,
  CatalogQuery,
  CatalogStatusFilter,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { Movie, PaginatedResponse, Request, Session } from '../../../contracts';
import type {
  MovieDTO,
  MovieImageDTO,
  PaginatedResponseDTO,
  PagedResponseDTO,
  RequestDTO,
  SessionDTO
} from '../../../api/types';
import type { ApiRequestOptions } from '../../../api/http';
import {
  createRequest as createRequestApi,
  getMovieById as getMovieByIdApi,
  listMovies as listMoviesApi,
  listRequests as listRequestsApi,
  listSessions as listSessionsApi
} from '../../../api/services';

const DEFAULT_TIMEOUT_MS = 10000;

const normalizeCatalogStatus = (status?: CatalogStatusFilter) => {
  if (!status) {
    return undefined;
  }
  if (status === 'SCREENED') {
    return 'EXHIBITED';
  }
  if (status === 'SCHEDULED') {
    return 'UPCOMING';
  }
  return status;
};

const isPagedResponse = <T,>(value: unknown): value is PagedResponseDTO<T> => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Array.isArray(record.items) && typeof record.pageInfo === 'object';
};

const toPaginatedResponse = <T,>(
  value: PagedResponseDTO<T> | PaginatedResponseDTO<T> | PaginatedResponse<T>
) => {
  if (isPagedResponse<T>(value)) {
    return {
      items: value.items,
      page: value.pageInfo.page,
      pageSize: value.pageInfo.pageSize,
      total: value.pageInfo.totalItems
    } satisfies PaginatedResponse<T>;
  }
  return value as PaginatedResponse<T>;
};

const normalizeMovieImages = (images?: MovieImageDTO | null) => {
  const poster = images?.poster ?? images?.posterUrl ?? null;
  const backdrop = images?.backdrop ?? images?.backdropUrl ?? null;
  if (!poster && !backdrop) {
    return null;
  }
  return { poster, backdrop };
};

const normalizeMovie = (movie: MovieDTO): Movie => ({
  id: movie.id ?? '',
  tmdbId: movie.tmdbId ?? null,
  title: movie.title ?? movie.originalTitle ?? '',
  originalTitle: movie.originalTitle ?? null,
  originalLanguage: movie.originalLanguage ?? null,
  overview: movie.overview ?? null,
  releaseDate: movie.releaseDate ?? null,
  releaseYear: movie.releaseYear ?? null,
  runtimeMinutes: movie.runtimeMinutes ?? null,
  certification: movie.certification ?? null,
  imdbUrl: movie.imdbUrl ?? null,
  images: normalizeMovieImages(movie.images),
  genres: movie.genres ?? null,
  metrics: movie.metrics ?? null,
  status: movie.status ?? null
});

const normalizeSessionStatus = (status?: string): Session['status'] => {
  if (status === 'UPCOMING') {
    return 'UPCOMING';
  }
  if (status === 'DONE' || status === 'CANCELLED' || status === 'PAST') {
    return 'PAST';
  }
  return 'PAST';
};

const normalizeSession = (session: SessionDTO): Session => ({
  id: session.id ?? '',
  filmId: session.filmId ?? session.movie?.id ?? session.movieId ?? '',
  startsAt: session.startsAt ?? session.startDateTime ?? '',
  status: normalizeSessionStatus(session.status),
  host: session.host ?? 'A definir',
  room: session.room ?? 'Discord',
  notes: session.notes ?? undefined
});

const normalizeRequestStatus = (status?: string): Request['status'] => {
  if (!status) {
    return 'OPEN';
  }
  if (status === 'OPEN' || status === 'APPROVED' || status === 'DECLINED') {
    return status;
  }
  if (status === 'PENDING') {
    return 'OPEN';
  }
  if (status === 'REJECTED') {
    return 'DECLINED';
  }
  if (status === 'FULFILLED') {
    return 'APPROVED';
  }
  return 'OPEN';
};

const normalizeRequest = (request: RequestDTO): Request => ({
  id: request.id ?? '',
  title: request.title ?? 'Titulo indisponivel',
  link: request.link ?? request.movie?.imdbUrl ?? request.posterUrl ?? '',
  reason: request.reason ?? request.notes ?? '',
  status: normalizeRequestStatus(request.status),
  createdAt: request.createdAt ?? request.requestedAt ?? new Date().toISOString()
});

export class HttpAdapter implements ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(
    baseUrl: string = import.meta.env.VITE_SF_API_BASE_URL ?? '',
    timeoutMs: number = DEFAULT_TIMEOUT_MS
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
  }

  private get options(): ApiRequestOptions {
    return { baseUrl: this.baseUrl, timeoutMs: this.timeoutMs };
  }

  async getCatalog(query: CatalogQuery = {}): Promise<PaginatedResponse<Movie>> {
    const status = normalizeCatalogStatus(query.status);
    const response = await listMoviesApi(
      {
        query: query.query,
        genre: query.genre,
        genreId: query.genreId,
        year: query.year,
        status,
        sort: query.sort,
        page: query.page,
        pageSize: query.pageSize
      },
      this.options
    );
    const page = toPaginatedResponse<MovieDTO>(response);
    return {
      ...page,
      items: page.items.map((movie) => normalizeMovie(movie))
    };
  }

  async getFilmById(id: string): Promise<Movie> {
    const response = await getMovieByIdApi(id, this.options);
    return normalizeMovie(response);
  }

  async getUpcomingSessions(): Promise<Session[]> {
    const response = await listSessionsApi({ scope: 'upcoming' }, this.options);
    const items = Array.isArray(response) ? response : response.items;
    return items.map(normalizeSession).filter((session) => session.status === 'UPCOMING');
  }

  async getPastSessions(query: PastSessionsQuery = {}): Promise<Session[]> {
    const response = await listSessionsApi(
      { scope: 'past', page: query.page, pageSize: query.pageSize },
      this.options
    );
    const items = Array.isArray(response) ? response : response.items;
    return items.map(normalizeSession).filter((session) => session.status === 'PAST');
  }

  async listRequests(query: RequestListQuery = {}): Promise<PaginatedResponse<Request>> {
    const sort = query.sort
      ? query.sort === 'newest'
        ? 'requestedAt_desc'
        : 'requestedAt_asc'
      : undefined;
    const response = await listRequestsApi(
      {
        sort,
        page: query.page,
        pageSize: query.pageSize
      },
      this.options
    );
    const page = toPaginatedResponse<RequestDTO>(response);
    return {
      ...page,
      items: page.items.map((request) => normalizeRequest(request))
    };
  }

  async createRequest(payload: CreateRequestPayload): Promise<Request> {
    const body = {
      title: payload.title,
      notes: payload.reason,
      posterUrl: payload.link || undefined
    };
    const response = await createRequestApi(body, this.options);
    return normalizeRequest(response);
  }
}
