export type ErrorDTO = {
  code: string;
  message: string;
  details: string | null;
};

export type PageInfoDTO = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PagedResponseDTO<T> = {
  items: T[];
  pageInfo: PageInfoDTO;
};

export type MovieStatusDTO = 'EXHIBITED' | 'UPCOMING';

export type MovieGenreDTO = {
  id: string | number;
  name: string;
};

export type MovieImageDTO = {
  posterUrl?: string | null;
  backdropUrl?: string | null;
  poster?: string | null;
  backdrop?: string | null;
};

export type MovieMetricsDTO = {
  voteAverage?: number | null;
};

export type MovieDTO = {
  id: string;
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
  releaseYear?: number | null;
  runtimeMinutes?: number | null;
  certification?: string | null;
  status?: MovieStatusDTO | null;
  genres?: MovieGenreDTO[] | null;
  images?: MovieImageDTO | null;
  metrics?: MovieMetricsDTO | null;
};

export type MovieSummaryDTO = MovieDTO;

export type SessionStatusDTO = 'UPCOMING' | 'PAST';

export type SessionDTO = {
  id: string;
  filmId?: string | null;
  movieId?: string | null;
  startsAt?: string | null;
  status?: SessionStatusDTO | null;
  host?: string | null;
  room?: string | null;
  notes?: string | null;
};

export type RequestStatusDTO = 'OPEN' | 'APPROVED' | 'DECLINED';

export type RequestDTO = {
  id: string;
  title: string;
  link?: string | null;
  reason?: string | null;
  status?: RequestStatusDTO | null;
  createdAt?: string | null;
  requestedAt?: string | null;
  requestedById?: string | null;
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
  hero: HomeHeroDTO;
  lastExhibited: MovieSummaryDTO[];
  mostRequested: MovieSummaryDTO[];
};

export type MovieSortDTO = 'releaseDate_desc' | 'releaseDate_asc';
export type RequestSortDTO = 'requestedAt_desc' | 'requestedAt_asc';
