import { useEffect, useMemo, useState } from 'react';
import type { Film, Session } from '../../contracts';
import { catalogRepository } from '../../domain/repositories/catalog.repository';
import { sessionsRepository } from '../../domain/repositories/sessions.repository';
import { formatDay, formatDate } from '../../domain/format';
import { groupSessionsByDay } from '../../domain/sessions';
import EmptyState from '../components/EmptyState';
import SkeletonList from '../components/SkeletonList';

/**
 * Available session tabs.
 */
type TabKey = 'UPCOMING' | 'PAST';

/**
 * Sessions page with upcoming and past listings.
 *
 * @returns Sessions page section.
 */
const SessionsPage = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tab, setTab] = useState<TabKey>('UPCOMING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [filmData, upcomingSessions, pastSessions] = await Promise.all([
          catalogRepository.getCatalog(),
          sessionsRepository.getUpcomingSessions(),
          sessionsRepository.getPastSessions()
        ]);
        if (mounted) {
          setFilms(filmData.items);
          setSessions([...upcomingSessions, ...pastSessions]);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err && typeof err === 'object' && 'message' in err
              ? String((err as { message: string }).message)
              : 'Nao foi possivel carregar as sessoes.';
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
  }, [reloadToken]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => session.status === tab)
      .sort((a, b) => {
        const aHasDate = Boolean(a.startsAt);
        const bHasDate = Boolean(b.startsAt);
        if (!aHasDate && !bHasDate) {
          return 0;
        }
        if (!aHasDate) {
          return 1;
        }
        if (!bHasDate) {
          return -1;
        }
        return a.startsAt.localeCompare(b.startsAt);
      });
  }, [sessions, tab]);

  const grouped = useMemo(() => groupSessionsByDay(filteredSessions), [filteredSessions]);

  return (
    <section>
      <header>
        <h1 className="page-title">Sessoes</h1>
        <p className="page-subtitle">
          Programe sua agenda com as sessoes do Discord e veja o que ja rolou.
        </p>
      </header>
      <div className="tab-row">
        <button
          className={`tab-button ${tab === 'UPCOMING' ? 'active' : ''}`}
          onClick={() => setTab('UPCOMING')}
        >
          Upcoming
        </button>
        <button
          className={`tab-button ${tab === 'PAST' ? 'active' : ''}`}
          onClick={() => setTab('PAST')}
        >
          Past
        </button>
      </div>
      {loading ? (
        <SkeletonList count={4} />
      ) : error ? (
        <EmptyState
          title="Falha ao carregar"
          description={error}
          actionLabel="Tentar novamente"
          onAction={() => setReloadToken((prev) => prev + 1)}
        />
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState
          title={tab === 'UPCOMING' ? 'Sem sessoes futuras' : 'Sem sessoes passadas'}
          description={
            tab === 'UPCOMING'
              ? 'Volte em breve para ver a proxima exibicao.'
              : 'Ainda nao registramos sessoes anteriores.'
          }
          actionLabel={tab === 'UPCOMING' ? 'Ver sessoes passadas' : 'Ver proximas'}
          onAction={() => setTab(tab === 'UPCOMING' ? 'PAST' : 'UPCOMING')}
        />
      ) : (
        <div className="list-group">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="session-group">
              <h3 className="session-date">{formatDay(date)}</h3>
              <div className="list-group">
                {items.map((session) => {
                  const film = films.find((item) => item.id === session.filmId);
                  return (
                    <article key={session.id} className="session-card">
                      <h4>{film?.title || 'Filme'}</h4>
                      <div className="session-meta">
                        <span>{formatDate(session.startsAt)}</span>
                        <span>{session.room}</span>
                        <span>Host: {session.host}</span>
                      </div>
                      {session.notes && <p>{session.notes}</p>}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SessionsPage;
