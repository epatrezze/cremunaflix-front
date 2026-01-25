import { useEffect, useMemo, useState } from 'react';
import type { Film, Session } from '../../contracts';
import { apiClient } from '../../services';
import { formatDay, formatDate } from '../../domain/format';
import { groupSessionsByDay } from '../../domain/sessions';

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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [filmData, sessionData] = await Promise.all([
        apiClient.getFilms(),
        apiClient.getSessions()
      ]);
      if (mounted) {
        setFilms(filmData);
        setSessions(sessionData);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => session.status === tab)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
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
        <div className="list-group">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`session-skeleton-${index}`} className="session-card skeleton">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>
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
