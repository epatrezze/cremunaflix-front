import { MockAdapter } from './adapters/MockAdapter';
import { HttpAdapter } from './adapters/HttpAdapter';

/**
 * Toggle between mock and HTTP adapters.
 *
 * @returns True when using mocks.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/**
 * Api client instance used across the UI.
 *
 * @returns ApiClient implementation.
 */
export const apiClient = USE_MOCK ? new MockAdapter() : new HttpAdapter();
