import type { Film } from '../../contracts';
import type { CSSProperties } from 'react';
import Badge from './Badge';

/**
 * Props for FilmCard component.
 */
interface FilmCardProps {
  film: Film;
  onSelect: (film: Film) => void;
}

/**
 * Film summary card used in grids and carousels.
 *
 * @param props - Film card props.
 * @returns Film card element.
 */
const FilmCard = ({ film, onSelect }: FilmCardProps) => {
  const cardBackdrop = film.poster ? `url(${film.poster})` : film.backdrop;

  return (
    <article
      className="card film-card flex flex-col overflow-hidden"
      style={
        {
          borderColor: `${film.accentColor}33`,
          '--card-accent': film.accentColor,
          '--card-backdrop': cardBackdrop
        } as CSSProperties
      }
    >
    <div className="film-card-media relative">
      <span className="film-card-rating absolute left-3 top-3 text-xs font-semibold">
        {film.rating.toFixed(1)}
      </span>
    </div>
    <div className="film-card-body flex flex-1 flex-col gap-2 p-5">
      <div className="film-card-title flex items-center justify-between gap-3">
        <h3>{film.title}</h3>
        <Badge label={film.status === 'SCREENED' ? 'Exibido' : 'Agendado'} />
      </div>
      <p className="film-card-meta text-sm">
        {film.year} - {film.durationMinutes} min
      </p>
      <p className="film-card-synopsis text-sm leading-relaxed">{film.synopsis}</p>
      <div className="film-card-footer mt-auto flex items-center justify-between gap-3">
        <button
          className="button-ghost"
          onClick={() => onSelect(film)}
          aria-label={`Ver detalhes de ${film.title}`}
        >
          Ver detalhes
        </button>
        <span className="film-card-genres">{film.genres.join(' / ')}</span>
      </div>
    </div>
    </article>
  );
};

export default FilmCard;
