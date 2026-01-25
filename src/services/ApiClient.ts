import type { Film, Session, Request } from '../contracts';

/**
 * Input payload for creating a new request.
 */
export interface CreateRequestPayload {
  /** Requested film title. */
  title: string;
  /** Reference link for the request. */
  link: string;
  /** Reason for requesting the film. */
  reason: string;
}

/**
 * Contract for data access, mocked or HTTP based.
 */
export interface ApiClient {
  /**
   * Returns the list of films.
   *
   * @returns Film list.
   */
  getFilms: () => Promise<Film[]>;
  /**
   * Returns the list of sessions.
   *
   * @returns Session list.
   */
  getSessions: () => Promise<Session[]>;
  /**
   * Returns the list of requests.
   *
   * @returns Request list.
   */
  getRequests: () => Promise<Request[]>;
  /**
   * Creates a new request and returns it.
   *
   * @param payload - Request payload.
   * @returns Created request.
   */
  createRequest: (payload: CreateRequestPayload) => Promise<Request>;
}
