import { fetchJson, type ApiRequestOptions } from '../http';
import type { MovieDTO, PaginatedResponseDTO, PagedResponseDTO } from '../types';

export type MoviesQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: string;
  sort?: string;
  year?: number;
  genre?: string;
  genreId?: string;
};

const buildParams = (query: MoviesQuery) => {
  const params = new URLSearchParams();
  if (query.query) params.set('query', query.query);
  if (query.status) params.set('status', query.status);
  if (query.sort) params.set('sort', query.sort);
  if (query.year) params.set('year', String(query.year));
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.genre) {
    params.set('genre', query.genre);
    if (!query.genreId) {
      params.set('genreId', query.genre);
    }
  }
  if (query.genreId) params.set('genreId', query.genreId);
  return params;
};

export const listMovies = (
  query: MoviesQuery = {},
  options?: ApiRequestOptions
) => {
  const params = buildParams(query);
  const suffix = params.toString();
  return fetchJson<PagedResponseDTO<MovieDTO> | PaginatedResponseDTO<MovieDTO>>(
    `/api/v1/movies${suffix ? `?${suffix}` : ''}`,
    {},
    options
  );
};

export const getMovieById = (id: string, options?: ApiRequestOptions) =>
  fetchJson<MovieDTO>(`/api/v1/movies/${id}`, {}, options);
