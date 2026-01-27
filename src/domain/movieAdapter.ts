import type { Film, FilmStatus, Movie, MovieStatus, PaginatedResponse } from '../contracts';

const DEFAULT_BACKDROP =
  'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(24, 34, 56, 0.75) 55%, rgba(28, 18, 30, 0.65) 100%)';
const DEFAULT_ACCENT = '#ff6b4a';

const safeNumber = (value: number | null | undefined, fallback: number) =>
  typeof value === 'number' && !Number.isNaN(value) ? value : fallback;

const parseYear = (releaseDate?: string | null) => {
  if (!releaseDate) {
    return null;
  }
  const year = Number(releaseDate.slice(0, 4));
  return Number.isNaN(year) ? null : year;
};

const normalizeBackdrop = (movie: Movie | null | undefined) => {
  const backdrop = movie?.images?.backdrop ?? movie?.images?.poster ?? null;
  if (backdrop) {
    return `url(${backdrop})`;
  }
  return DEFAULT_BACKDROP;
};

const normalizePoster = (movie: Movie | null | undefined) => {
  const poster = movie?.images?.poster ?? null;
  return poster ?? undefined;
};

const normalizeStatus = (status?: MovieStatus | null): FilmStatus => {
  if (status === 'EXHIBITED') {
    return 'SCREENED';
  }
  if (status === 'SCHEDULED') {
    return 'SCHEDULED';
  }
  return 'SCHEDULED';
};

const hashToHue = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
};

const normalizeAccent = (movie: Movie | null | undefined) => {
  const source = movie?.id ?? movie?.title ?? '';
  if (!source) {
    return DEFAULT_ACCENT;
  }
  const hue = hashToHue(source);
  return `hsl(${hue} 70% 62%)`;
};

export const adaptMovieToFilm = (movie: Movie): Film => {
  const title = movie.title || movie.originalTitle || 'Titulo indisponivel';
  const year = safeNumber(movie.releaseYear ?? parseYear(movie.releaseDate), 0);
  const synopsis = movie.overview?.trim() || 'Sem sinopse disponivel.';

  return {
    id: movie.id,
    title,
    year,
    durationMinutes: safeNumber(movie.runtimeMinutes, 0),
    genres: movie.genres?.map((genre) => genre.name) ?? [],
    synopsis,
    rating: safeNumber(movie.metrics?.voteAverage, 0),
    status: normalizeStatus(movie.status ?? undefined),
    accentColor: normalizeAccent(movie),
    backdrop: normalizeBackdrop(movie),
    poster: normalizePoster(movie),
    certification: movie.certification ?? null
  };
};

export const adaptMoviesToFilms = (movies: Movie[]) => movies.map(adaptMovieToFilm);

export const adaptMoviePageToFilms = (
  page: PaginatedResponse<Movie>
): PaginatedResponse<Film> => ({
  ...page,
  items: adaptMoviesToFilms(page.items)
});
