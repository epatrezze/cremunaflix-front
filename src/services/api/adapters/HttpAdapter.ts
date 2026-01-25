import type {
  ApiClient,
  CatalogQuery,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { ApiError, Film, PaginatedResponse, Request, Session } from '../../../contracts';
import type { AuthTokenProvider } from '../auth';
import { NullAuthTokenProvider } from '../auth';

const DEFAULT_TIMEOUT_MS = 10000;

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

  async getCatalog(query: CatalogQuery = {}): Promise<PaginatedResponse<Film>> {
    const params = new URLSearchParams();
    if (query.query) params.set('query', query.query);
    if (query.genre) params.set('genre', query.genre);
    if (query.year) params.set('year', String(query.year));
    if (query.status) params.set('status', query.status);
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));

    const suffix = params.toString();
    return this.request(`/api/v1/catalog${suffix ? `?${suffix}` : ''}`);
  }

  async getFilmById(id: string): Promise<Film> {
    return this.request(`/api/v1/films/${id}`);
  }

  async getUpcomingSessions(): Promise<Session[]> {
    return this.request('/api/v1/sessions/upcoming');
  }

  async getPastSessions(query: PastSessionsQuery = {}): Promise<Session[]> {
    const params = new URLSearchParams();
    if (query.from) params.set('from', query.from);
    if (query.to) params.set('to', query.to);

    const suffix = params.toString();
    return this.request(`/api/v1/sessions/past${suffix ? `?${suffix}` : ''}`);
  }

  async listRequests(query: RequestListQuery = {}): Promise<PaginatedResponse<Request>> {
    const params = new URLSearchParams();
    if (query.sort) params.set('sort', query.sort);
    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));

    const suffix = params.toString();
    return this.request(`/api/v1/requests${suffix ? `?${suffix}` : ''}`);
  }

  async createRequest(payload: CreateRequestPayload): Promise<Request> {
    return this.request('/api/v1/requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}
