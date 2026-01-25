export type FilmStatus = 'SCREENED' | 'SCHEDULED';

export interface Film {
  id: string;
  title: string;
  year: number;
  durationMinutes: number;
  genres: string[];
  synopsis: string;
  rating: number;
  status: FilmStatus;
  accentColor: string;
  backdrop: string;
}
