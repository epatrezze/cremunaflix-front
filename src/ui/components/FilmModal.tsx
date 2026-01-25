import { useEffect } from 'react';
import type { Film } from '../../contracts';
import Badge from './Badge';

interface FilmModalProps {
  film: Film | null;
  onClose: () => void;
}

const FilmModal = ({ film, onClose }: FilmModalProps) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!film) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal"
        style={{ borderColor: `${film.accentColor}55` }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <Badge label={film.status === 'SCREENED' ? 'Exibido' : 'Agendado'} />
            <h2 className="page-title">{film.title}</h2>
          </div>
          <button className="button-ghost" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </button>
        </div>
        <div className="modal-content">
          <div className="film-modal-hero" style={{ background: film.backdrop }} />
          <p>{film.synopsis}</p>
          <div className="session-meta">
            <span>{film.year}</span>
            <span>{film.durationMinutes} min</span>
            <span>{film.genres.join(' / ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmModal;
