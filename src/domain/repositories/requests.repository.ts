import type { ApiClient, CreateRequestPayload, RequestListQuery } from '../../services';
import type { PaginatedResponse, Request } from '../../contracts';
import { apiClient } from '../../services';

/**
 * Repository for requests data access.
 */
export class RequestsRepository {
  private client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Returns paginated requests.
   */
  listRequests(query?: RequestListQuery): Promise<PaginatedResponse<Request>> {
    return this.client.listRequests(query);
  }

  /**
   * Creates a new request.
   */
  createRequest(payload: CreateRequestPayload): Promise<Request> {
    return this.client.createRequest(payload);
  }
}

export const requestsRepository = new RequestsRepository();
