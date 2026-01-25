import type { Request } from '../contracts';

export const requests: Request[] = [
  {
    id: 'req-001',
    title: 'Blade Runner 2049',
    link: 'https://www.imdb.com/title/tt1856101/',
    reason: 'Visual cinematografico e trilha impecavel para sessao comentada.',
    status: 'APPROVED',
    createdAt: '2024-07-01T10:30:00-03:00'
  },
  {
    id: 'req-002',
    title: 'A Chegada',
    link: 'https://www.imdb.com/title/tt2543164/',
    reason: 'Narrativa sobre comunicacao e linguagem.',
    status: 'OPEN',
    createdAt: '2024-07-05T14:12:00-03:00'
  },
  {
    id: 'req-003',
    title: 'Ex Machina',
    link: 'https://www.imdb.com/title/tt0470752/',
    reason: 'Debate sobre etica em IA.',
    status: 'APPROVED',
    createdAt: '2024-07-08T09:05:00-03:00'
  },
  {
    id: 'req-004',
    title: 'Drive',
    link: 'https://www.imdb.com/title/tt0780504/',
    reason: 'Estetica neon e narrativa minimalista.',
    status: 'OPEN',
    createdAt: '2024-07-09T11:45:00-03:00'
  },
  {
    id: 'req-005',
    title: 'Her',
    link: 'https://www.imdb.com/title/tt1798709/',
    reason: 'Romance futurista com trilha sensivel.',
    status: 'OPEN',
    createdAt: '2024-07-10T08:22:00-03:00'
  },
  {
    id: 'req-006',
    title: 'Moon',
    link: 'https://www.imdb.com/title/tt1182345/',
    reason: 'Boa para debate sobre solidao e identidade.',
    status: 'DECLINED',
    createdAt: '2024-07-11T16:40:00-03:00'
  },
  {
    id: 'req-007',
    title: 'Sound of Metal',
    link: 'https://www.imdb.com/title/tt5363618/',
    reason: 'Impacto sonoro para experiencia coletiva.',
    status: 'OPEN',
    createdAt: '2024-07-13T13:18:00-03:00'
  },
  {
    id: 'req-008',
    title: 'O Lagosta',
    link: 'https://www.imdb.com/title/tt3464902/',
    reason: 'Comedia absurda para sessao de humor negro.',
    status: 'OPEN',
    createdAt: '2024-07-14T09:50:00-03:00'
  },
  {
    id: 'req-009',
    title: 'O Hospedeiro',
    link: 'https://www.imdb.com/title/tt0468492/',
    reason: 'Suspense sul-coreano para sessao especial.',
    status: 'OPEN',
    createdAt: '2024-07-15T15:03:00-03:00'
  },
  {
    id: 'req-010',
    title: 'O Farol',
    link: 'https://www.imdb.com/title/tt7984734/',
    reason: 'Atmosfera claustrofobica e fotografia marcante.',
    status: 'OPEN',
    createdAt: '2024-07-16T19:27:00-03:00'
  }
];
