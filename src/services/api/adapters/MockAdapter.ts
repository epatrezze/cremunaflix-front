import type {
  ApiClient,
  CatalogQuery,
  CreateRequestPayload,
  PastSessionsQuery,
  RequestListQuery
} from '../ApiClient';
import type { PaginatedResponse, Request } from '../../../contracts';
import { films, requests, sessions } from '../../../mocks';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createId = () => `req-${Date.now().toString(36)}`;

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

  async getCatalog(query: CatalogQuery = {}) {
    await delay(220);
    const normalizedQuery = query.query?.toLowerCase().trim();
    const filtered = films.filter((film) => {
      const matchesQuery = normalizedQuery
        ? film.title.toLowerCase().includes(normalizedQuery)
        : true;
      const matchesGenre = query.genre ? film.genres.includes(query.genre) : true;
      const matchesYear = query.year ? film.year === query.year : true;
      const matchesStatus = query.status ? film.status === query.status : true;
      return matchesQuery && matchesGenre && matchesYear && matchesStatus;
    });

    return paginate(filtered, query.page ?? 1, query.pageSize ?? 20);
  }

  async getFilmById(id: string) {
    await delay(200);
    const film = films.find((item) => item.id === id);
    if (!film) {
      throw new Error(`Film not found: ${id}`);
    }
    return film;
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
