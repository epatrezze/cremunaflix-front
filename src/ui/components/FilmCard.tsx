import type { Film } from '../../contracts';
import Badge from './Badge';

interface FilmCardProps {
  film: Film;
  onSelect: (film: Film) => void;
}

const FilmCard = ({ film, onSelect }: FilmCardProps) => (
  <article className="card film-card" style={{ borderColor: `${film.accentColor}33` }}>
    <div className="film-card-media" style={{ background: film.backdrop }}>
      <span className="film-card-rating">{film.rating.toFixed(1)}</span>
    </div>
    <div className="film-card-body">
      <div className="film-card-title">
        <h3>{film.title}</h3>
        <Badge label={film.status === 'SCREENED' ? 'Exibido' : 'Agendado'} />
      </div>
      <p className="film-card-meta">
        {film.year} - {film.durationMinutes} min
      </p>
      <p className="film-card-synopsis">{film.synopsis}</p>
      <div className="film-card-footer">
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

export default FilmCard;
