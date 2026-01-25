import type { ApiClient, CreateRequestPayload } from '../ApiClient';
import type { Request } from '../../contracts';
import { films, requests, sessions } from '../../mocks';

/**
 * Simulates network latency for mock calls.
 *
 * @param ms - Milliseconds to wait.
 * @returns Promise resolved after the delay.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a simple request id.
 *
 * @returns Unique request id.
 */
const createId = () => `req-${Date.now().toString(36)}`;

/**
 * Mock implementation of ApiClient using local fixtures.
 */
export class MockAdapter implements ApiClient {
  /**
   * Local in-memory store for requests.
   */
  private requestStore: Request[];

  /**
   * Initializes the store from static mocks.
   */
  constructor() {
    this.requestStore = [...requests];
  }

  /**
   * Returns the list of films.
   *
   * @returns Film list.
   */
  async getFilms() {
    await delay(350);
    return films;
  }

  /**
   * Returns the list of sessions.
   *
   * @returns Session list.
   */
  async getSessions() {
    await delay(300);
    return sessions;
  }

  /**
   * Returns the list of requests.
   *
   * @returns Request list.
   */
  async getRequests() {
    await delay(300);
    return this.requestStore;
  }

  /**
   * Creates a new request in the local store.
   *
   * @param payload - Request payload.
   * @returns Created request.
   */
  async createRequest(payload: CreateRequestPayload) {
    await delay(400);
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
