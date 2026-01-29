export type ErrorDTO = {
  code: string;
  message: string;
  details?: string | null;
};

export type PageInfoDTO = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
};

export type PagedResponseDTO<T> = {
  items: T[];
  pageInfo: PageInfoDTO;
};

export type PaginatedResponseDTO<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type MovieStatusDTO = 'EXHIBITED' | 'UPCOMING' | (string & {});

export type MovieGenreDTO = {
  id: string | number;
  name: string;
  tmdbId?: number | null;
};

export type MovieImageDTO = {
  posterUrl?: string | null;
  backdropUrl?: string | null;
  poster?: string | null;
  backdrop?: string | null;
};

export type MovieMetricsDTO = {
  popularity?: number | null;
  voteAverage?: number | null;
  voteCount?: number | null;
};

export type MovieDTO = {
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
  status?: MovieStatusDTO | null;
  genres?: MovieGenreDTO[] | null;
  images?: MovieImageDTO | null;
  metrics?: MovieMetricsDTO | null;
};

export type MovieSummaryDTO = MovieDTO;

export type SessionStatusDTO = 'UPCOMING' | 'PAST';

export type SessionDTO = {
  id?: string;
  filmId?: string | null;
  movieId?: string | null;
  startsAt?: string | null;
  startDateTime?: string | null;
  status?: SessionStatusDTO | null;
  host?: string | null;
  room?: string | null;
  notes?: string | null;
  movie?: { id?: string | null } | null;
};

export type RequestStatusDTO = 'OPEN' | 'APPROVED' | 'DECLINED';

export type RequestDTO = {
  id?: string;
  title?: string;
  link?: string | null;
  reason?: string | null;
  notes?: string | null;
  status?: RequestStatusDTO | null;
  createdAt?: string | null;
  requestedAt?: string | null;
  requestedById?: string | null;
  posterUrl?: string | null;
  movie?: { imdbUrl?: string | null } | null;
};

export type RequestCreateDTO = {
  title: string;
  requestedById: string;
  link?: string | null;
  reason?: string | null;
};

export type HomeHeroDTO = {
  title: string;
  items: SessionDTO[];
};

export type HomeResponseDTO = {
  hero?: HomeHeroDTO | null;
  lastExhibited: MovieSummaryDTO[];
  mostRequested: MovieSummaryDTO[];
};

export type MovieSortDTO = 'releaseDate_desc' | 'releaseDate_asc';
export type RequestSortDTO = 'requestedAt_desc' | 'requestedAt_asc';
