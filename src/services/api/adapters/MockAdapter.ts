import type {
  ApiClient,
  CatalogQuery,
  CatalogStatusFilter,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { Movie, PaginatedResponse, Request } from '../../../contracts';
import { movies, requests, sessions } from '../../../mocks';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createId = () => `req-${Date.now().toString(36)}`;

const normalizeCatalogStatus = (status?: CatalogStatusFilter) => {
  if (!status) {
    return undefined;
  }
  if (status === 'SCREENED') {
    return 'EXHIBITED';
  }
  return status;
};

const parseYear = (releaseDate?: string | null) => {
  if (!releaseDate) {
    return null;
  }
  const year = Number(releaseDate.slice(0, 4));
  return Number.isNaN(year) ? null : year;
};

const paginate = <T>(items: T[], page = 1, pageSize = 20): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length
  };
};

export class MockAdapter implements ApiClient {
  private requestStore: Request[];

  constructor() {
    this.requestStore = [...requests];
  }

  async getCatalog(query: CatalogQuery = {}): Promise<PaginatedResponse<Movie>> {
    await delay(220);
    const normalizedQuery = query.query?.toLowerCase().trim();
    const status = normalizeCatalogStatus(query.status);
    const filtered = movies.filter((movie) => {
      const matchesQuery = normalizedQuery
        ? movie.title.toLowerCase().includes(normalizedQuery) ||
          (movie.originalTitle ?? '').toLowerCase().includes(normalizedQuery)
        : true;
      const matchesGenre = query.genre
        ? movie.genres?.some((genre) => genre.name === query.genre)
        : true;
      const movieYear = movie.releaseYear ?? parseYear(movie.releaseDate);
      const matchesYear = query.year ? movieYear === query.year : true;
      const matchesStatus = status ? movie.status === status : true;
      return matchesQuery && matchesGenre && matchesYear && matchesStatus;
    });

    return paginate(filtered, query.page ?? 1, query.pageSize ?? 20);
  }

  async getFilmById(id: string) {
    await delay(200);
    const movie = movies.find((item) => item.id === id);
    if (!movie) {
      throw new Error(`Movie not found: ${id}`);
    }
    return movie;
  }

  async getUpcomingSessions() {
    await delay(240);
    return sessions
      .filter((session) => session.status === 'UPCOMING')
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  async getPastSessions(query: PastSessionsQuery = {}) {
    await delay(240);
    const fromDate = query.from ? new Date(query.from) : null;
    const toDate = query.to ? new Date(query.to) : null;

    return sessions
      .filter((session) => session.status === 'PAST')
      .filter((session) => {
        const sessionDate = new Date(session.startsAt);
        if (fromDate && sessionDate < fromDate) {
          return false;
        }
        if (toDate && sessionDate > toDate) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  }

  async listRequests(query: RequestListQuery = {}) {
    await delay(220);
    const sorted = [...this.requestStore].sort((a, b) => {
      if (query.sort === 'oldest') {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

    return paginate(sorted, query.page ?? 1, query.pageSize ?? 10);
  }

  async createRequest(payload: CreateRequestPayload) {
    await delay(260);
    const newRequest: Request = {
      id: createId(),
      title: payload.title,
      link: payload.link,
      reason: payload.reason,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    this.requestStore = [newRequest, ...this.requestStore];
    return newRequest;
  }
}
