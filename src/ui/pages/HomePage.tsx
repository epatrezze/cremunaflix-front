import { useEffect, useMemo, useState } from 'react';
import type { Film, Session, Request } from '../../contracts';
import { apiClient } from '../../services';
import Hero from '../components/Hero';
import CarouselRow from '../components/CarouselRow';
import FilmModal from '../components/FilmModal';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

/**
 * Home page with hero and curated carousels.
 *
 * @returns Home page section.
 */
const HomePage = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [filmData, sessionData, requestData] = await Promise.all([
        apiClient.getCatalog(),
        apiClient.getUpcomingSessions(),
        apiClient.listRequests()
      ]);
      if (mounted) {
        setFilms(filmData.items);
        setSessions(sessionData);
        setRequests(requestData.items);
        setLoading(false);
      }
    };
    load();

    return () => {
      mounted = false;
    };
  }, []);

  const nextSession = useMemo(() => {
    return sessions
      .filter((session) => session.status === 'UPCOMING')
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  }, [sessions]);

  const nextSessionFilm = useMemo(() => {
    if (!nextSession) {
      return null;
    }
    return films.find((film) => film.id === nextSession.filmId) || null;
  }, [films, nextSession]);

  const latestScreened = useMemo(() => {
    return films
      .filter((film) => film.status === 'SCREENED')
      .sort((a, b) => b.year - a.year)
      .slice(0, 8);
  }, [films]);

  const mostRequested = useMemo(() => {
    const ranked = [...films].sort((a, b) => b.rating - a.rating);
    if (requests.length > 0) {
      return ranked.slice(0, 8);
    }
    return ranked.slice(0, 8);
  }, [films, requests]);

  /**
   * Renders a skeleton carousel section while data loads.
   *
   * @param title - Section title.
   * @param subtitle - Section subtitle.
   * @param keyPrefix - Key prefix for skeleton items.
   * @returns Skeleton carousel section.
   */
  const renderSkeletonRow = (title: string, subtitle: string, keyPrefix: string) => (
    <section className="carousel">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="carousel-track">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={`${keyPrefix}-${index}`} />
        ))}
      </div>
    </section>
  );

  return (
    <section>
      <Hero
        film={nextSessionFilm}
        session={nextSession || null}
        onSelect={setSelectedFilm}
      />
      {loading ? (
        renderSkeletonRow(
          'Ultimas exibidas',
          'Reprises comentadas das ultimas semanas',
          'latest'
        )
      ) : latestScreened.length === 0 ? (
        <EmptyState
          title="Nada exibido ainda"
          description="Assim que as sessoes acontecerem, os titulos aparecem aqui."
        />
      ) : (
        <CarouselRow
          title="Ultimas exibidas"
          subtitle="Reprises comentadas das ultimas semanas"
          items={latestScreened}
          onSelect={setSelectedFilm}
        />
      )}
      {loading ? (
        renderSkeletonRow(
          'Mais pedidos',
          'Titulos que a comunidade mais pede para voltar',
          'requested'
        )
      ) : mostRequested.length === 0 ? (
        <EmptyState
          title="Sem pedidos ainda"
          description="A comunidade ainda nao enviou pedidos recentes."
        />
      ) : (
        <CarouselRow
          title="Mais pedidos"
          subtitle="Titulos que a comunidade mais pede para voltar"
          items={mostRequested}
          onSelect={setSelectedFilm}
        />
      )}
      <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
    </section>
  );
};

export default HomePage;
