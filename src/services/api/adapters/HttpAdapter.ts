import type {
  ApiClient,
  CatalogQuery,
  CatalogStatusFilter,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { ApiError, Movie, PaginatedResponse, Request, Session } from '../../../contracts';
import type { AuthTokenProvider } from '../auth';
import { NullAuthTokenProvider } from '../auth';

const DEFAULT_TIMEOUT_MS = 10000;

type PageInfo = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
};

type PagedResponse<T> = {
  items: T[];
  pageInfo: PageInfo;
};

type MovieImageResponse = {
  poster?: string | null;
  backdrop?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
};

type MovieResponse = Omit<Movie, 'images'> & {
  images?: MovieImageResponse | null;
};

type SessionResponse = {
  id?: string;
  filmId?: string;
  movieId?: string;
  startsAt?: string;
  startDateTime?: string;
  status?: string;
  host?: string;
  room?: string;
  notes?: string;
  movie?: { id?: string | null } | null;
};

type RequestResponse = {
  id?: string;
  title?: string;
  link?: string;
  reason?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
  requestedAt?: string;
  posterUrl?: string;
  movie?: { imdbUrl?: string | null } | null;
};

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

const isPagedResponse = <T,>(value: unknown): value is PagedResponse<T> => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Array.isArray(record.items) && typeof record.pageInfo === 'object';
};

const toPaginatedResponse = <T,>(value: PagedResponse<T> | PaginatedResponse<T>) => {
  if (isPagedResponse<T>(value)) {
    return {
      items: value.items,
      page: value.pageInfo.page,
      pageSize: value.pageInfo.pageSize,
      total: value.pageInfo.totalItems
    } satisfies PaginatedResponse<T>;
  }
  return value;
};

const normalizeMovieImages = (images?: MovieImageResponse | null) => {
  const poster = images?.poster ?? images?.posterUrl ?? null;
  const backdrop = images?.backdrop ?? images?.backdropUrl ?? null;
  if (!poster && !backdrop) {
    return null;
  }
  return { poster, backdrop };
};

const normalizeMovie = (movie: MovieResponse): Movie => ({
  ...movie,
  images: normalizeMovieImages(movie.images)
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

const normalizeSession = (session: SessionResponse): Session => ({
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

const normalizeRequest = (request: RequestResponse): Request => ({
  id: request.id ?? '',
  title: request.title ?? 'Titulo indisponivel',
  link: request.link ?? request.movie?.imdbUrl ?? request.posterUrl ?? '',
  reason: request.reason ?? request.notes ?? '',
  status: normalizeRequestStatus(request.status),
  createdAt: request.createdAt ?? request.requestedAt ?? new Date().toISOString()
});

export class HttpAdapter implements ApiClient {
  private baseUrl: string;
  private authTokenProvider: AuthTokenProvider;
  private timeoutMs: number;

  constructor(
    baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? '',
    authTokenProvider: AuthTokenProvider = NullAuthTokenProvider,
    timeoutMs: number = DEFAULT_TIMEOUT_MS
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.authTokenProvider = authTokenProvider;
    this.timeoutMs = timeoutMs;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const token = await this.authTokenProvider.getToken();
      const headers = new Headers(init?.headers);

      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers,
        signal: controller.signal
      });

      if (!response.ok) {
        const errorBody = await this.readBody(response);
        throw this.toApiError(response.status, errorBody);
      }

      return this.readBody(response) as Promise<T>;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw { code: 'TIMEOUT', message: 'Request timed out', details: path } satisfies ApiError;
      }

      if (error && typeof error === 'object' && 'code' in error) {
        throw error;
      }

      throw { code: 'NETWORK_ERROR', message: 'Network error', details: String(error) } satisfies ApiError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async readBody(response: Response): Promise<unknown> {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }

    return response.text();
  }

  private toApiError(status: number, body: unknown): ApiError {
    if (body && typeof body === 'object') {
      const maybeError = body as Partial<ApiError>;
      return {
        code: maybeError.code ?? `HTTP_${status}`,
        message: maybeError.message ?? 'Request failed',
        details: maybeError.details
      };
    }

    if (typeof body === 'string' && body.trim()) {
      return { code: `HTTP_${status}`, message: body };
    }

    return { code: `HTTP_${status}`, message: 'Request failed' };
  }

  async getCatalog(query: CatalogQuery = {}): Promise<PaginatedResponse<Movie>> {
    const params = new URLSearchParams();
    if (query.query) params.set('query', query.query);
    if (query.genre) {
      params.set('genre', query.genre);
      params.set('genreId', query.genre);
    }
    if (query.year) params.set('year', String(query.year));
    const status = normalizeCatalogStatus(query.status);
    if (status) params.set('status', status);
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));

    const suffix = params.toString();
    const response = await this.request<PagedResponse<MovieResponse> | PaginatedResponse<MovieResponse>>(
      `/api/v1/movies${suffix ? `?${suffix}` : ''}`
    );
    const page = toPaginatedResponse(response);
    return {
      ...page,
      items: page.items.map((movie) => normalizeMovie(movie))
    };
  }

  async getFilmById(id: string): Promise<Movie> {
    const response = await this.request<MovieResponse>(`/api/v1/movies/${id}`);
    return normalizeMovie(response);
  }

  async getUpcomingSessions(): Promise<Session[]> {
    const response = await this.request<PagedResponse<SessionResponse> | SessionResponse[]>(
      '/api/v1/sessions?scope=upcoming'
    );
    const items = Array.isArray(response) ? response : response.items;
    return items.map(normalizeSession).filter((session) => session.status === 'UPCOMING');
  }

  async getPastSessions(query: PastSessionsQuery = {}): Promise<Session[]> {
    const params = new URLSearchParams();
    params.set('scope', 'past');
    if (query.from) params.set('from', query.from);
    if (query.to) params.set('to', query.to);

    const suffix = params.toString();
    const response = await this.request<PagedResponse<SessionResponse> | SessionResponse[]>(
      `/api/v1/sessions${suffix ? `?${suffix}` : ''}`
    );
    const items = Array.isArray(response) ? response : response.items;
    return items.map(normalizeSession).filter((session) => session.status === 'PAST');
  }

  async listRequests(query: RequestListQuery = {}): Promise<PaginatedResponse<Request>> {
    const params = new URLSearchParams();
    if (query.sort) {
      params.set('sort', query.sort === 'newest' ? 'requestedAt_desc' : 'requestedAt_asc');
    }
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));

    const suffix = params.toString();
    const response = await this.request<PagedResponse<RequestResponse> | PaginatedResponse<RequestResponse>>(
      `/api/v1/requests${suffix ? `?${suffix}` : ''}`
    );
    const page = toPaginatedResponse(response);
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
    const response = await this.request<RequestResponse>('/api/v1/requests', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return normalizeRequest(response);
  }
}
