import type { Movie } from '../contracts';

const posterSet = [
  'https://image.tmdb.org/t/p/w500/wFMkqerSlifIae2cja6K1fdvz2G.jpg',
  'https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg',
  'https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg',
  'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
  'https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg'
];

const backdropSet = [
  'https://image.tmdb.org/t/p/w1280/huUgrGkCetYSkDl5fMvZCXCbFKl.jpg',
  'https://image.tmdb.org/t/p/w1280/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg',
  'https://image.tmdb.org/t/p/w1280/rmZ3tYb5z7I8bZ2xH1QQg51e06q.jpg',
  'https://image.tmdb.org/t/p/w1280/5hNcsnMkwU2LknLoru73c76el3z.jpg',
  'https://image.tmdb.org/t/p/w1280/7fKAbKjGQd9QyB4KxgtYy3r1B2c.jpg'
];

const pickImage = (list: string[], index: number) => list[index % list.length];

export const movies: Movie[] = [
  {
    id: 'a0B000000001EAAQ',
    tmdbId: 7347,
    title: 'Neon Drift',
    originalTitle: 'Neon Drift',
    originalLanguage: 'en',
    overview:
      'Uma piloto de testes descobre uma cidade espelhada escondida sob a metropole e precisa escolher qual realidade salvar.',
    releaseDate: '2023-03-10',
    releaseYear: 2023,
    runtimeMinutes: 118,
    certification: '14',
    imdbUrl: 'https://www.imdb.com/title/tt0000001/',
    images: {
      poster: pickImage(posterSet, 0),
      backdrop: pickImage(backdropSet, 0)
    },
    genres: [
      { id: 878, name: 'Sci-Fi' },
      { id: 53, name: 'Thriller' }
    ],
    metrics: {
      popularity: 7.1,
      voteAverage: 8.1,
      voteCount: 1480
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000002EAAQ',
    tmdbId: 4012,
    title: 'Aurora 77',
    originalTitle: 'Aurora 77',
    originalLanguage: 'en',
    overview:
      'Num inverno sem fim, uma radio pirata transmite mensagens que conectam pessoas de tempos diferentes.',
    releaseDate: '2022-09-02',
    releaseYear: 2022,
    runtimeMinutes: 104,
    certification: '12',
    imdbUrl: 'https://www.imdb.com/title/tt0000002/',
    images: {
      poster: pickImage(posterSet, 1),
      backdrop: pickImage(backdropSet, 1)
    },
    genres: [
      { id: 18, name: 'Drama' },
      { id: 9648, name: 'Mystery' }
    ],
    metrics: {
      popularity: 6.4,
      voteAverage: 7.6,
      voteCount: 980
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000003EAAQ',
    tmdbId: 5491,
    title: 'Mare de Marte',
    originalTitle: 'Mare de Marte',
    originalLanguage: 'pt',
    overview:
      'Uma equipe de pesquisadores enfrenta tempestades eletromagneticas enquanto tenta restaurar um farol marciano.',
    releaseDate: '2024-02-16',
    releaseYear: 2024,
    runtimeMinutes: 129,
    certification: '12',
    imdbUrl: 'https://www.imdb.com/title/tt0000003/',
    images: {
      poster: pickImage(posterSet, 2),
      backdrop: pickImage(backdropSet, 2)
    },
    genres: [
      { id: 12, name: 'Adventure' },
      { id: 878, name: 'Sci-Fi' }
    ],
    metrics: {
      popularity: 9.8,
      voteAverage: 8.4,
      voteCount: 1320
    },
    status: 'SCHEDULED'
  },
  {
    id: 'a0B000000004EAAQ',
    tmdbId: 8742,
    title: 'Duna de Vidro',
    originalTitle: 'Duna de Vidro',
    originalLanguage: 'pt',
    overview:
      'Uma restauradora de vitrais revisita o deserto onde perdeu a familia e encontra um novo comeco.',
    releaseDate: '2021-08-12',
    releaseYear: 2021,
    runtimeMinutes: 97,
    certification: '14',
    imdbUrl: 'https://www.imdb.com/title/tt0000004/',
    images: {
      poster: pickImage(posterSet, 3),
      backdrop: pickImage(backdropSet, 3)
    },
    genres: [
      { id: 18, name: 'Drama' },
      { id: 10749, name: 'Romance' }
    ],
    metrics: {
      popularity: 5.5,
      voteAverage: 7.2,
      voteCount: 640
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000005EAAQ',
    tmdbId: 9912,
    title: 'Ritual do Vinil',
    originalTitle: 'Ritual do Vinil',
    originalLanguage: 'pt',
    overview:
      'Um colecionador encontra um disco que abre um portal sonoro para um teatro abandonado.',
    releaseDate: '2020-11-20',
    releaseYear: 2020,
    runtimeMinutes: 112,
    certification: '16',
    imdbUrl: 'https://www.imdb.com/title/tt0000005/',
    images: {
      poster: pickImage(posterSet, 4),
      backdrop: pickImage(backdropSet, 4)
    },
    genres: [
      { id: 27, name: 'Horror' },
      { id: 9648, name: 'Mystery' }
    ],
    metrics: {
      popularity: 6.9,
      voteAverage: 7.9,
      voteCount: 880
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000006EAAQ',
    tmdbId: 2194,
    title: 'Atlas do Oceano',
    originalTitle: 'Atlas do Oceano',
    originalLanguage: 'pt',
    overview:
      'Uma capita mapeia rotas esquecidas enquanto registra historias de comunidades costeiras.',
    releaseDate: '2023-06-09',
    releaseYear: 2023,
    runtimeMinutes: 123,
    certification: '10',
    imdbUrl: 'https://www.imdb.com/title/tt0000006/',
    images: {
      poster: pickImage(posterSet, 1),
      backdrop: pickImage(backdropSet, 1)
    },
    genres: [
      { id: 99, name: 'Documentary' },
      { id: 12, name: 'Adventure' }
    ],
    metrics: {
      popularity: 6.3,
      voteAverage: 8.0,
      voteCount: 710
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000007EAAQ',
    tmdbId: 8871,
    title: 'Cidade em Silencio',
    originalTitle: 'Cidade em Silencio',
    originalLanguage: 'pt',
    overview:
      'Um jornalista surdo investiga um apagao de dados que alterou a memoria coletiva de uma cidade.',
    releaseDate: '2019-04-05',
    releaseYear: 2019,
    runtimeMinutes: 99,
    certification: '14',
    imdbUrl: 'https://www.imdb.com/title/tt0000007/',
    images: {
      poster: pickImage(posterSet, 2),
      backdrop: pickImage(backdropSet, 2)
    },
    genres: [{ id: 53, name: 'Thriller' }],
    metrics: {
      popularity: 5.9,
      voteAverage: 7.4,
      voteCount: 510
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000008EAAQ',
    tmdbId: 1091,
    title: 'Solaris Drive',
    originalTitle: 'Solaris Drive',
    originalLanguage: 'en',
    overview:
      'Uma piloto de corridas espaciais aceita a ultima prova para impedir uma guerra entre colonias.',
    releaseDate: '2024-05-17',
    releaseYear: 2024,
    runtimeMinutes: 110,
    certification: '14',
    imdbUrl: 'https://www.imdb.com/title/tt0000008/',
    images: {
      poster: pickImage(posterSet, 3),
      backdrop: pickImage(backdropSet, 3)
    },
    genres: [
      { id: 28, name: 'Action' },
      { id: 878, name: 'Sci-Fi' }
    ],
    metrics: {
      popularity: 9.3,
      voteAverage: 8.3,
      voteCount: 1520
    },
    status: 'SCHEDULED'
  },
  {
    id: 'a0B000000009EAAQ',
    tmdbId: 6552,
    title: 'Jardim das Mares',
    originalTitle: 'Jardim das Mares',
    originalLanguage: 'pt',
    overview:
      'Uma botanica descobre um jardim que floresce apenas quando alguem conta a verdade.',
    releaseDate: '2022-01-21',
    releaseYear: 2022,
    runtimeMinutes: 95,
    certification: '12',
    imdbUrl: 'https://www.imdb.com/title/tt0000009/',
    images: {
      poster: pickImage(posterSet, 0),
      backdrop: pickImage(backdropSet, 0)
    },
    genres: [
      { id: 14, name: 'Fantasy' },
      { id: 18, name: 'Drama' }
    ],
    metrics: {
      popularity: 6.8,
      voteAverage: 7.7,
      voteCount: 690
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000010EAAQ',
    tmdbId: 4441,
    title: 'Labirinto de Neon',
    originalTitle: 'Labirinto de Neon',
    originalLanguage: 'pt',
    overview:
      'Uma hacker infiltra um cartel de dados para derrubar o sistema de vigilancia de uma megacorp.',
    releaseDate: '2021-10-08',
    releaseYear: 2021,
    runtimeMinutes: 121,
    certification: '16',
    imdbUrl: 'https://www.imdb.com/title/tt0000010/',
    images: {
      poster: pickImage(posterSet, 4),
      backdrop: pickImage(backdropSet, 4)
    },
    genres: [
      { id: 28, name: 'Action' },
      { id: 80, name: 'Crime' }
    ],
    metrics: {
      popularity: 7.4,
      voteAverage: 8.0,
      voteCount: 1160
    },
    status: 'EXHIBITED'
  },
  {
    id: 'a0B000000011EAAQ',
    tmdbId: 3121,
    title: 'Faroeste Lunar',
    originalTitle: 'Faroeste Lunar',
    originalLanguage: 'pt',
    overview:
      'Uma xerife em uma colonia lunar persegue um contrabandista que rouba reservas de agua.',
    releaseDate: '2024-07-19',
    releaseYear: 2024,
    runtimeMinutes: 116,
    certification: '14',
    imdbUrl: 'https://www.imdb.com/title/tt0000011/',
    images: {
      poster: pickImage(posterSet, 1),
      backdrop: pickImage(backdropSet, 1)
    },
    genres: [
      { id: 37, name: 'Western' },
      { id: 878, name: 'Sci-Fi' }
    ],
    metrics: {
      popularity: 8.6,
      voteAverage: 8.2,
      voteCount: 920
    },
    status: 'SCHEDULED'
  },
  {
    id: 'a0B000000012EAAQ',
    tmdbId: 8822,
    title: 'Catedral de Bruma',
    originalTitle: 'Catedral de Bruma',
    originalLanguage: 'pt',
    overview:
      'Uma arquiteta investiga uma catedral que muda de forma a cada lua cheia.',
    releaseDate: '2024-11-22',
    releaseYear: 2024,
    runtimeMinutes: 132,
    certification: '12',
    imdbUrl: 'https://www.imdb.com/title/tt0000012/',
    images: {
      poster: pickImage(posterSet, 2),
      backdrop: pickImage(backdropSet, 2)
    },
    genres: [
      { id: 14, name: 'Fantasy' },
      { id: 9648, name: 'Mystery' }
    ],
    metrics: {
      popularity: 8.9,
      voteAverage: 8.5,
      voteCount: 1040
    },
    status: 'SCHEDULED'
  }
];
