import { useEffect, useRef } from 'react';
import type { Film } from '../../contracts';
import Badge from './Badge';

/**
 * Props for FilmModal component.
 */
interface FilmModalProps {
  film: Film | null;
  onClose: () => void;
}

/**
 * Modal with film details and close handlers.
 *
 * @param props - Film modal props.
 * @returns Modal element or null when closed.
 */
const FilmModal = ({ film, onClose }: FilmModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!film) {
      return;
    }
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      lastFocusedRef.current?.focus();
    };
  }, [film]);

  if (!film) {
    return null;
  }

  const titleId = `film-modal-title-${film.id}`;
  const descriptionId = `film-modal-desc-${film.id}`;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={onClose}
    >
      <div
        className="modal"
        style={{ borderColor: `${film.accentColor}55` }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <Badge label={film.status === 'SCREENED' ? 'Exibido' : 'Agendado'} />
            <h2 className="page-title" id={titleId}>
              {film.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            className="button-ghost"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        </div>
        <div className="modal-content">
          <div className="film-modal-hero" style={{ background: film.backdrop }} />
          <p id={descriptionId}>{film.synopsis}</p>
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
