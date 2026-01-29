import { useEffect, useState } from 'react';
import type { Film } from '../../contracts';
import { getHome } from '../../api/services';
import { normalizeMovieDto, normalizeSessionDto } from '../../domain/dtoAdapters';
import { adaptMovieToFilm } from '../../domain/movieAdapter';
import { catalogRepository } from '../../domain/repositories/catalog.repository';
import { sessionsRepository } from '../../domain/repositories/sessions.repository';
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
  const [heroFilms, setHeroFilms] = useState<Film[]>([]);
  const [lastExhibited, setLastExhibited] = useState<Film[]>([]);
  const [mostRequested, setMostRequested] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const handleRetry = () => setReloadToken((prev) => prev + 1);
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (useMock) {
          const [filmData, sessionData] = await Promise.all([
            catalogRepository.getCatalog(),
            sessionsRepository.getUpcomingSessions(),
          ]);
          const films = filmData.items;
          const nextSession = sessionData
            .filter((session) => session.status === 'UPCOMING')
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
          const nextSessionFilm = nextSession
            ? films.find((film) => film.id === nextSession.filmId) || null
            : null;
          const latestScreened = films
            .filter((film) => film.status === 'SCREENED')
            .sort((a, b) => b.year - a.year)
            .slice(0, 8);
          const ranked = [...films].sort((a, b) => b.rating - a.rating);
          const mostRequestedLocal = ranked.slice(0, 8);

          if (mounted) {
            setHeroFilms(
              nextSessionFilm
                ? [nextSessionFilm, ...films.filter((film) => film.id !== nextSessionFilm.id)]
                : films
            );
            setLastExhibited(latestScreened);
            setMostRequested(mostRequestedLocal);
          }
        } else {
          const home = await getHome();
          const lastExhibitedFilms = home.lastExhibited.map((item) =>
            adaptMovieToFilm(normalizeMovieDto(item))
          );
          const mostRequestedFilms = home.mostRequested.map((item) =>
            adaptMovieToFilm(normalizeMovieDto(item))
          );
          const filmIndex = new Map<string, Film>();
          [...lastExhibitedFilms, ...mostRequestedFilms].forEach((film) => {
            filmIndex.set(film.id, film);
          });
          const heroSessions = home.hero?.items ?? [];
          const heroFilmsFromSessions = heroSessions
            .map((session) => normalizeSessionDto(session).filmId)
            .map((id) => filmIndex.get(id))
            .filter(Boolean) as Film[];

          if (mounted) {
            const fallbackFilms =
              lastExhibitedFilms.length > 0 ? lastExhibitedFilms : mostRequestedFilms;
            setHeroFilms(heroFilmsFromSessions.length > 0 ? heroFilmsFromSessions : fallbackFilms);
            setLastExhibited(lastExhibitedFilms);
            setMostRequested(mostRequestedFilms);
          }
        }
      } catch (err) {
        if (mounted) {
          const message =
            err && typeof err === 'object' && 'message' in err
              ? String((err as { message: string }).message)
              : 'Nao foi possivel carregar a home.';
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();

    return () => {
      mounted = false;
    };
  }, [reloadToken, useMock]);


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
        items={heroFilms}
        loading={loading}
        onSelect={setSelectedFilm}
      />
      {loading ? (
        renderSkeletonRow(
          'Ultimas exibidas',
          'Reprises comentadas das ultimas semanas',
          'latest'
        )
      ) : error ? (
        <EmptyState
          title="Falha ao carregar"
          description={error}
          actionLabel="Tentar novamente"
          onAction={handleRetry}
        />
      ) : lastExhibited.length === 0 ? (
        <EmptyState
          title="Nada exibido ainda"
          description="Assim que as sessoes acontecerem, os titulos aparecem aqui."
        />
      ) : (
        <CarouselRow
          title="Ultimas exibidas"
          subtitle="Reprises comentadas das ultimas semanas"
          items={lastExhibited}
          onSelect={setSelectedFilm}
        />
      )}
      {loading ? (
        renderSkeletonRow(
          'Mais pedidos',
          'Titulos que a comunidade mais pede para voltar',
          'requested'
        )
      ) : error ? (
        <EmptyState
          title="Falha ao carregar"
          description={error}
          actionLabel="Tentar novamente"
          onAction={handleRetry}
        />
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
