import type { ApiClient, CreateRequestPayload } from '../ApiClient';

/**
 * HTTP adapter placeholder for a future API.
 */
export class HttpAdapter implements ApiClient {
  /**
   * Returns the list of films from the API.
   *
   * @returns Film list.
   */
  async getFilms() {
    throw new Error('HttpAdapter not implemented.');
  }

  /**
   * Returns the list of sessions from the API.
   *
   * @returns Session list.
   */
  async getSessions() {
    throw new Error('HttpAdapter not implemented.');
  }

  /**
   * Returns the list of requests from the API.
   *
   * @returns Request list.
   */
  async getRequests() {
    throw new Error('HttpAdapter not implemented.');
  }

  /**
   * Creates a new request via the API.
   *
   * @param _payload - Request payload.
   * @returns Created request.
   */
  async createRequest(_payload: CreateRequestPayload) {
    throw new Error('HttpAdapter not implemented.');
  }
}
