import { fetchJson, type ApiRequestOptions } from '../http';
import type { HomeResponseDTO } from '../types';

export const getHome = (options?: ApiRequestOptions) =>
  fetchJson<HomeResponseDTO>('/api/v1/home', {}, options);
