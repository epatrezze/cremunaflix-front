import { useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { Film } from '../../contracts';
import FilmCard from './FilmCard';

/**
 * Props for CarouselRow component.
 */
interface CarouselRowProps {
  title: string;
  subtitle?: string;
  items: Film[];
  onSelect: (film: Film) => void;
}

/**
 * Horizontal carousel for film cards.
 *
 * @param props - Carousel row props.
 * @returns Carousel section.
 */
const CarouselRow = ({ title, subtitle, items, onSelect }: CarouselRowProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByPage = useCallback((direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const scrollAmount = Math.max(0, Math.floor(track.clientWidth * 0.9));
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByPage(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByPage(1);
      }
    },
    [scrollByPage]
  );

  return (
    <section className="carousel">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="carousel-shell">
        <button
          className="carousel-nav carousel-prev"
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Rolar para a esquerda"
        >
          ‹
        </button>
        <div
          ref={trackRef}
          className="carousel-track"
          role="list"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={`Carrossel ${title}`}
        >
          {items.map((film) => (
            <div key={film.id} className="carousel-item" role="listitem">
              <FilmCard film={film} onSelect={onSelect} />
            </div>
          ))}
        </div>
        <button
          className="carousel-nav carousel-next"
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Rolar para a direita"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default CarouselRow;
