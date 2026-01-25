import type { Session } from '../contracts';

export const sessions: Session[] = [
  {
    id: 'session-001',
    filmId: 'film-003',
    startsAt: '2024-09-05T20:00:00-03:00',
    status: 'UPCOMING',
    host: 'Equipe Cremuna',
    room: 'Discord - Sala Aurora',
    notes: 'Sessao comentada com trilha extra.'
  },
  {
    id: 'session-002',
    filmId: 'film-008',
    startsAt: '2024-09-12T20:30:00-03:00',
    status: 'UPCOMING',
    host: 'Clube Sci-Fi',
    room: 'Discord - Sala Orbit',
    notes: 'Chat liberado apos o segundo ato.'
  },
  {
    id: 'session-003',
    filmId: 'film-011',
    startsAt: '2024-09-20T21:00:00-03:00',
    status: 'UPCOMING',
    host: 'Equipe Cremuna',
    room: 'Discord - Sala Lunar'
  },
  {
    id: 'session-004',
    filmId: 'film-015',
    startsAt: '2024-10-03T20:00:00-03:00',
    status: 'UPCOMING',
    host: 'Curadoria Noir',
    room: 'Discord - Sala Neblina'
  },
  {
    id: 'session-005',
    filmId: 'film-006',
    startsAt: '2024-07-19T20:00:00-03:00',
    status: 'PAST',
    host: 'Equipe Cremuna',
    room: 'Discord - Sala Oceano'
  },
  {
    id: 'session-006',
    filmId: 'film-010',
    startsAt: '2024-07-04T21:00:00-03:00',
    status: 'PAST',
    host: 'Clube Cyber',
    room: 'Discord - Sala Neon'
  },
  {
    id: 'session-007',
    filmId: 'film-002',
    startsAt: '2024-06-14T20:00:00-03:00',
    status: 'PAST',
    host: 'Equipe Cremuna',
    room: 'Discord - Sala Aurora'
  },
  {
    id: 'session-008',
    filmId: 'film-016',
    startsAt: '2024-05-31T20:00:00-03:00',
    status: 'PAST',
    host: 'Curadoria Romance',
    room: 'Discord - Sala Prisma'
  }
];
