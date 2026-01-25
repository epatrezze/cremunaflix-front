export type SessionStatus = 'UPCOMING' | 'PAST';

export interface Session {
  id: string;
  filmId: string;
  startsAt: string;
  status: SessionStatus;
  host: string;
  room: string;
  notes?: string;
}
