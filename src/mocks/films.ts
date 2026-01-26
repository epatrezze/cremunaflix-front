import type { Film } from '../contracts';
import { adaptMoviesToFilms } from '../domain/movieAdapter';
import { movies } from './movies';

export const films: Film[] = adaptMoviesToFilms(movies);
