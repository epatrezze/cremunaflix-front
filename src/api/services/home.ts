import { fetchJson, type ApiRequestOptions } from '../http';
import type { HomeResponseDTO } from '../../types/dtos';

export const getHome = (options?: ApiRequestOptions) =>
  fetchJson<HomeResponseDTO>('/home', {}, options);
