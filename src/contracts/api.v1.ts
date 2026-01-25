import type { Film, FilmStatus } from './film';
import type { Session, SessionStatus } from './session';
import type { Request, RequestStatus } from './request';
import type { PaginatedResponse } from './pagination';

export type {
  Film,
  FilmStatus,
  Session,
  SessionStatus,
  Request,
  RequestStatus,
  PaginatedResponse
};

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}
