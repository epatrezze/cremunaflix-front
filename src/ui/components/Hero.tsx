import type { Film, Session } from '../../contracts';
import Badge from './Badge';
import { formatDate } from '../../domain/format';

interface HeroProps {
  film: Film | null;
  session: Session | null;
  onSelect?: (film: Film) => void;
}

const Hero = ({ film, session, onSelect }: HeroProps) => {
  if (!film || !session) {
    return (
      <section className="hero">
        <div className="hero-content">
          <Badge label="Proxima sessao" />
          <h1>Preparando a proxima sessao</h1>
          <p>Estamos ajustando o calendario do Discord. Volte em instantes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" style={{ background: film.backdrop }}>
      <div className="hero-content reveal">
        <Badge label="Proxima sessao" />
        <h1>{film.title}</h1>
        <p>{film.synopsis}</p>
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
        <div className="session-meta">
          <span>{formatDate(session.startsAt)}</span>
          <span>{session.room}</span>
          <span>Host: {session.host}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
