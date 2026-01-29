import type {
  MovieDTO,
  MovieImageDTO,
  MovieSummaryDTO,
  RequestDTO,
  SessionDTO
} from '../types/dtos';
import type { Movie, Request, Session } from '../contracts';

const normalizeMovieImages = (images?: MovieImageDTO | null) => {
  const poster = images?.poster ?? images?.posterUrl ?? null;
  const backdrop = images?.backdrop ?? images?.backdropUrl ?? null;
  if (!poster && !backdrop) {
    return null;
  }
  return { poster, backdrop };
};

export const normalizeMovieDto = (movie: MovieDTO | MovieSummaryDTO): Movie => ({
  id: movie.id ?? '',
  tmdbId: null,
  title: movie.title ?? movie.originalTitle ?? '',
  originalTitle: movie.originalTitle ?? null,
  originalLanguage: null,
  overview: movie.overview ?? null,
  releaseDate: movie.releaseDate ?? null,
  releaseYear: movie.releaseYear ?? null,
  runtimeMinutes: movie.runtimeMinutes ?? null,
  certification: movie.certification ?? null,
  imdbUrl: null,
  images: normalizeMovieImages(movie.images),
  genres: movie.genres ?? null,
  metrics: movie.metrics ?? null,
  status: movie.status ?? null
});

const normalizeSessionStatus = (status?: string | null): Session['status'] => {
  if (status === 'UPCOMING') {
    return 'UPCOMING';
  }
  return 'PAST';
};

const resolveSessionStartsAt = (session: SessionDTO) => {
  const candidate =
    session.startsAt ??
    (session as Record<string, unknown>).startAt ??
    (session as Record<string, unknown>).startDate ??
    (session as Record<string, unknown>).sessionDate ??
    (session as Record<string, unknown>).starts_at ??
    null;

  if (typeof candidate === 'string') {
    return candidate;
  }
  if (typeof candidate === 'number') {
    const date = new Date(candidate);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  }
  if (candidate instanceof Date) {
    return candidate.toISOString();
  }
  return '';
};

export const normalizeSessionDto = (session: SessionDTO): Session => ({
  id: session.id ?? '',
  filmId: session.filmId ?? session.movieId ?? '',
  startsAt: resolveSessionStartsAt(session),
  status: normalizeSessionStatus(session.status),
  host: session.host ?? 'A definir',
  room: session.room ?? 'Discord',
  notes: session.notes ?? undefined
});

const normalizeRequestStatus = (status?: string | null): Request['status'] => {
  if (status === 'APPROVED' || status === 'DECLINED' || status === 'OPEN') {
    return status;
  }
  return 'OPEN';
};

export const normalizeRequestDto = (request: RequestDTO): Request => ({
  id: request.id ?? '',
  title: request.title ?? 'Titulo indisponivel',
  link: request.link ?? '',
  reason: request.reason ?? '',
  status: normalizeRequestStatus(request.status),
  createdAt: request.createdAt ?? request.requestedAt ?? new Date().toISOString()
});
