import type { MovieDTO } from './movie';
import type { SessionDTO } from './session';
import type { RequestDTO } from './request';
import type { PaginatedResponseDTO } from './pagination';

export interface HomeResponseDTO {
  catalog: PaginatedResponseDTO<MovieDTO>;
  upcomingSessions: SessionDTO[];
  requests: PaginatedResponseDTO<RequestDTO>;
}
