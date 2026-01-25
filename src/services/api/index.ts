import { MockAdapter } from './adapters/MockAdapter';
import { HttpAdapter } from './adapters/HttpAdapter';

const rawFlag = import.meta.env.VITE_USE_MOCK;
const USE_MOCK = rawFlag ? rawFlag !== 'false' : true;

export const apiClient = USE_MOCK ? new MockAdapter() : new HttpAdapter();

export type {
  ApiClient,
  CatalogQuery,
  PastSessionsQuery,
  RequestListQuery,
  CreateRequestPayload
} from './ApiClient';
