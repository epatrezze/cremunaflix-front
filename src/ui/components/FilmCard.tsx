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
  const metaPieces = [
    film.year ? String(film.year) : null,
    film.durationMinutes ? `${film.durationMinutes} min` : null,
    film.certification ? `Classificacao ${film.certification}` : null
  ].filter(Boolean);

  return (
    <article
      className="card film-card"
      style={
        {
          borderColor: `${film.accentColor}33`,
          '--card-accent': film.accentColor,
          '--card-backdrop': cardBackdrop
        } as CSSProperties
      }
    >
      <div className="film-card-media" aria-hidden="true" />
      <div className="film-card-overlay">
        <div className="film-card-badge">
          <Badge label={film.status === 'SCREENED' ? 'Exibido' : 'Agendado'} />
        </div>
        <h3 className="film-card-title">{film.title}</h3>
        {metaPieces.length > 0 && <p className="film-card-meta">{metaPieces.join(' • ')}</p>}
        <p className="film-card-overview">{film.synopsis}</p>
        {film.genres.length > 0 && (
          <div className="film-card-genres" aria-hidden="true">
            {film.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="film-card-genre-chip">
                {genre}
              </span>
            ))}
          </div>
        )}
        <button
          className="button-ghost film-card-action"
          type="button"
          onClick={() => onSelect(film)}
          aria-label={`Ver detalhes de ${film.title}`}
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
};

export default FilmCard;
