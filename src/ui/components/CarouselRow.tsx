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
const CarouselRow = ({ title, subtitle, items, onSelect }: CarouselRowProps) => (
  <section className="carousel">
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
    <div className="carousel-track" role="list">
      {items.map((film) => (
        <div key={film.id} className="carousel-item" role="listitem">
          <FilmCard film={film} onSelect={onSelect} />
        </div>
      ))}
    </div>
  </section>
);

export default CarouselRow;
