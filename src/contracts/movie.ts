export type MovieStatus = 'EXHIBITED' | 'SCHEDULED' | (string & {});

export interface MovieImageSet {
  poster: string | null;
  backdrop: string | null;
}

export interface MovieGenre {
  id: number | string;
  name: string;
  tmdbId?: number | null;
}

export interface MovieMetrics {
  popularity: number | null;
  voteAverage: number | null;
  voteCount: number | null;
}

export interface Movie {
  id: string;
  tmdbId: number | null;
  title: string;
  originalTitle: string | null;
  originalLanguage: string | null;
  overview: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  runtimeMinutes: number | null;
  certification: string | null;
  imdbUrl: string | null;
  images: MovieImageSet | null;
  genres: MovieGenre[] | null;
  metrics: MovieMetrics | null;
  status: MovieStatus | null;
}

export type MovieList = Movie[];
