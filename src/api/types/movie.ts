export type MovieStatusDTO = string;

export interface MovieImageDTO {
  poster?: string | null;
  backdrop?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
}

export interface MovieGenreDTO {
  id?: number | string;
  name?: string;
  tmdbId?: number | null;
}

export interface MovieMetricsDTO {
  popularity?: number | null;
  voteAverage?: number | null;
  voteCount?: number | null;
}

export interface MovieDTO {
  id?: string;
  tmdbId?: number | null;
  title?: string;
  originalTitle?: string | null;
  originalLanguage?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  releaseYear?: number | null;
  runtimeMinutes?: number | null;
  certification?: string | null;
  imdbUrl?: string | null;
  images?: MovieImageDTO | null;
  genres?: MovieGenreDTO[] | null;
  metrics?: MovieMetricsDTO | null;
  status?: MovieStatusDTO | null;
}
