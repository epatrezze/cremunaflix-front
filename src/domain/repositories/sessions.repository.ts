import type { ApiClient, PastSessionsQuery } from '../../services';
import type { Session } from '../../contracts';
import { apiClient } from '../../services';

/**
 * Repository for sessions data access.
 */
export class SessionsRepository {
  private client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Returns upcoming sessions.
   */
  getUpcomingSessions(): Promise<Session[]> {
    return this.client.getUpcomingSessions();
  }

  /**
   * Returns past sessions, optionally filtered by date range.
   */
  getPastSessions(query?: PastSessionsQuery): Promise<Session[]> {
    return this.client.getPastSessions(query);
  }
}

export const sessionsRepository = new SessionsRepository();
