import type {
  ApiClient,
  CatalogQuery,
  CatalogStatusFilter,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { Movie, PaginatedResponse, Request, Session } from '../../../contracts';
import type { MovieDTO, MovieStatusDTO, PagedResponseDTO, RequestDTO } from '../../../types/dtos';
import type { ApiRequestOptions } from '../../../api/http';
import {
  createRequest as createRequestApi,
  getMovieById as getMovieByIdApi,
  listMovies as listMoviesApi,
  listRequests as listRequestsApi,
  listSessions as listSessionsApi
} from '../../../api/services';
import { normalizeMovieDto, normalizeRequestDto, normalizeSessionDto } from '../../../domain/dtoAdapters';

const DEFAULT_TIMEOUT_MS = 10000;

const normalizeCatalogStatus = (status?: CatalogStatusFilter): MovieStatusDTO | undefined => {
  if (!status) {
    return undefined;
  }
  if (status === 'SCREENED') {
    return 'EXHIBITED';
  }
  if (status === 'SCHEDULED') {
    return 'UPCOMING';
  }
  if (status === 'EXHIBITED' || status === 'UPCOMING') {
    return status;
  }
  return undefined;
};

const toPaginatedResponse = <T,>(value: PagedResponseDTO<T>): PaginatedResponse<T> => ({
  items: value.items,
  page: value.pageInfo.page,
  pageSize: value.pageInfo.pageSize,
  total: value.pageInfo.totalItems
});

export class HttpAdapter implements ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(
    baseUrl: string = import.meta.env.VITE_API_BASE_URL ?? '',
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
      items: page.items.map((movie) => normalizeMovieDto(movie))
    };
  }

  async getFilmById(id: string): Promise<Movie> {
    const response = await getMovieByIdApi(id, this.options);
    return normalizeMovieDto(response);
  }

  async getUpcomingSessions(): Promise<Session[]> {
    const response = await listSessionsApi({ scope: 'upcoming' }, this.options);
    return response.items
      .map(normalizeSessionDto)
      .filter((session) => session.status === 'UPCOMING');
  }

  async getPastSessions(query: PastSessionsQuery = {}): Promise<Session[]> {
    const response = await listSessionsApi(
      { scope: 'past', page: query.page, pageSize: query.pageSize },
      this.options
    );
    return response.items
      .map(normalizeSessionDto)
      .filter((session) => session.status === 'PAST');
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
      items: page.items.map((request) => normalizeRequestDto(request))
    };
  }

  async createRequest(payload: CreateRequestPayload): Promise<Request> {
    const body = {
      title: payload.title,
      reason: payload.reason,
      link: payload.link || undefined,
      requestedById: payload.requestedById
    };
    const response = await createRequestApi(body, this.options);
    return normalizeRequestDto(response);
  }
}
