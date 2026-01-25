import type { Film, Session, Request } from '../contracts';

export interface CreateRequestPayload {
  title: string;
  link: string;
  reason: string;
}

export interface ApiClient {
  getFilms: () => Promise<Film[]>;
  getSessions: () => Promise<Session[]>;
  getRequests: () => Promise<Request[]>;
  createRequest: (payload: CreateRequestPayload) => Promise<Request>;
}
