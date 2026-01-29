import { fetchJson, withQuery, type ApiRequestOptions } from '../http';
import type { MovieDTO, MovieSortDTO, MovieStatusDTO, PagedResponseDTO } from '../../types/dtos';
import { normalizePagination } from './pagination';

export type MoviesQuery = {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: MovieStatusDTO;
  sort?: MovieSortDTO;
  year?: number;
  genreId?: string;
};

export const listMovies = (
  query: MoviesQuery = {},
  options?: ApiRequestOptions
) => {
  const pagination = normalizePagination(query.page, query.pageSize, { page: 1, pageSize: 20 });
  return fetchJson<PagedResponseDTO<MovieDTO>>(
    withQuery('/movies', {
      query: query.query,
      year: query.year,
      status: query.status,
      genreId: query.genreId,
      sort: query.sort ?? 'releaseDate_desc',
      page: pagination.page,
      pageSize: pagination.pageSize
    }),
    {},
    options
  );
};

export const getMovieById = (id: string, options?: ApiRequestOptions) =>
  fetchJson<MovieDTO>(`/movies/${id}`, {}, options);
