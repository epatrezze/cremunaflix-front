import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Film } from '../../contracts';
import Badge from './Badge';

/**
 * Props for Hero component.
 */
interface HeroProps {
  items: Film[];
  onSelect?: (film: Film) => void;
}

/**
 * Featured hero section for the next session.
 *
 * @param props - Hero props.
 * @returns Hero section or fallback when no session exists.
 */
const Hero = ({ items, onSelect }: HeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasItems = items.length > 0;

  useEffect(() => {
    if (!hasItems) {
      return;
    }
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, hasItems, items.length]);

  const heroItems = useMemo(() => items.slice(0, 6), [items]);

  const handlePrev = () => {
    if (!heroItems.length) return;
    setActiveIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const handleNext = () => {
    if (!heroItems.length) return;
    setActiveIndex((prev) => (prev + 1) % heroItems.length);
  };

  if (!heroItems.length) {
    return (
      <section className="hero-carousel hero-empty">
        <div className="hero-info">
          <Badge label="Proxima sessao" />
          <h1>Preparando a proxima sessao</h1>
          <p>Estamos ajustando o calendario do Discord. Volte em instantes.</p>
        </div>
      </section>
    );
  }

  const trackStyle: CSSProperties = {
    transform: `translateX(-${activeIndex * 100}%)`
  };

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Destaques">
      <div className="hero-track" style={trackStyle}>
        {heroItems.map((film, index) => {
          const ratingLabel = film.rating > 0 ? film.rating.toFixed(1) : '--';
          const metaPieces = [
            film.year ? String(film.year) : null,
            film.durationMinutes ? `${film.durationMinutes} min` : null,
            film.certification ? `Classificacao ${film.certification}` : null
          ].filter(Boolean);

          return (
            <article
              key={film.id}
              className="hero-slide"
              aria-hidden={index !== activeIndex}
              style={
                {
                  '--hero-slide-backdrop': film.backdrop,
                  '--hero-slide-accent': film.accentColor
                } as CSSProperties
              }
            >
              <div className="hero-slide-overlay" aria-hidden="true" />
              <div className="hero-info">
                <Badge label={film.status === 'SCREENED' ? 'Exibido' : 'Agendado'} />
                <h1>{film.title}</h1>
                <p className="hero-meta">{metaPieces.join(' • ')}</p>
                <div className="hero-rating">
                  <span className="hero-rating-score">{ratingLabel}</span>
                  <span className="hero-rating-label">/ 10</span>
                </div>
                <p className="hero-overview">{film.synopsis}</p>
                <div className="hero-actions">
                  <button className="button-primary" type="button">
                    Lembrar na agenda
                  </button>
                  <button
                    className="button-ghost"
                    type="button"
                    onClick={() => onSelect?.(film)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {heroItems.length > 1 && (
        <>
          <button
            className="hero-nav hero-prev"
            type="button"
            onClick={handlePrev}
            aria-label="Filme anterior"
          >
            ‹
          </button>
          <button
            className="hero-nav hero-next"
            type="button"
            onClick={handleNext}
            aria-label="Proximo filme"
          >
            ›
          </button>
          <div className="hero-dots" role="tablist" aria-label="Selecionar destaque">
            {heroItems.map((film, index) => (
              <button
                key={film.id}
                className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
                type="button"
                aria-label={`Ir para ${film.title}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
