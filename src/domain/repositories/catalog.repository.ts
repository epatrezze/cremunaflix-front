import type { ApiClient, CatalogQuery } from '../../services';
import type { Film, PaginatedResponse } from '../../contracts';
import { apiClient } from '../../services';
import { adaptMoviePageToFilms, adaptMovieToFilm } from '../movieAdapter';

/**
 * Repository for catalog/film data access.
 */
export class CatalogRepository {
  private client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Returns paginated catalog results.
   */
  async getCatalog(query?: CatalogQuery): Promise<PaginatedResponse<Film>> {
    const page = await this.client.getCatalog(query);
    return adaptMoviePageToFilms(page);
  }

  /**
   * Returns a single film by id.
   */
  async getFilmById(id: string): Promise<Film> {
    const movie = await this.client.getFilmById(id);
    return adaptMovieToFilm(movie);
  }
}

export const catalogRepository = new CatalogRepository();
