import type { ApiClient, CatalogQuery } from '../../services';
import type { Film, PaginatedResponse } from '../../contracts';
import { apiClient } from '../../services';

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
  getCatalog(query?: CatalogQuery): Promise<PaginatedResponse<Film>> {
    return this.client.getCatalog(query);
  }

  /**
   * Returns a single film by id.
   */
  getFilmById(id: string): Promise<Film> {
    return this.client.getFilmById(id);
  }
}

export const catalogRepository = new CatalogRepository();
