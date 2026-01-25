import { MockAdapter } from './adapters/MockAdapter';
import { HttpAdapter } from './adapters/HttpAdapter';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const apiClient = USE_MOCK ? new MockAdapter() : new HttpAdapter();
