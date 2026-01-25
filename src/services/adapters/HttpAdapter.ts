import type { ApiClient, CreateRequestPayload } from '../ApiClient';

export class HttpAdapter implements ApiClient {
  async getFilms() {
    throw new Error('HttpAdapter not implemented.');
  }

  async getSessions() {
    throw new Error('HttpAdapter not implemented.');
  }

  async getRequests() {
    throw new Error('HttpAdapter not implemented.');
  }

  async createRequest(_payload: CreateRequestPayload) {
    throw new Error('HttpAdapter not implemented.');
  }
}
