import type {
  ApiClient,
  CatalogQuery,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { Film, PaginatedResponse, Request, Session } from '../../../contracts';

export class HttpAdapter implements ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? '') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {})
      },
      ...init
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Request failed: ${response.status} ${message}`);
    }

    return response.json() as Promise<T>;
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
