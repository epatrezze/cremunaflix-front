export interface SessionDTO {
  id?: string;
  filmId?: string;
  movieId?: string;
  startsAt?: string;
  startDateTime?: string;
  status?: string;
  host?: string;
  room?: string;
  notes?: string;
  movie?: { id?: string | null } | null;
}
