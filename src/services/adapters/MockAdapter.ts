import type { ApiClient, CreateRequestPayload } from '../ApiClient';
import type { Request } from '../../contracts';
import { films, requests, sessions } from '../../mocks';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createId = () => `req-${Date.now().toString(36)}`;

export class MockAdapter implements ApiClient {
  private requestStore: Request[];

  constructor() {
    this.requestStore = [...requests];
  }

  async getFilms() {
    await delay(350);
    return films;
  }

  async getSessions() {
    await delay(300);
    return sessions;
  }

  async getRequests() {
    await delay(300);
    return this.requestStore;
  }

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
