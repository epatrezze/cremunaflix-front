import { useEffect, useMemo, useState } from 'react';
import type { Film } from '../../contracts';
import { apiClient } from '../../services';
import FilterBar from '../components/FilterBar';
import FilmCard from '../components/FilmCard';
import FilmModal from '../components/FilmModal';
import SkeletonCard from '../components/SkeletonCard';

/**
 * Catalog page with filters and film grid.
 *
 * @returns Catalog page section.
 */
const CatalogPage = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    status: ''
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await apiClient.getCatalog();
      if (mounted) {
        setFilms(data.items);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    films.forEach((film) => film.genres.forEach((genre) => set.add(genre)));
    return Array.from(set).sort();
  }, [films]);

  const years = useMemo(() => {
    const set = new Set<number>();
    films.forEach((film) => set.add(film.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [films]);

  const filtered = useMemo(() => {
    return films.filter((film) => {
      const matchesSearch = film.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesGenre = filters.genre ? film.genres.includes(filters.genre) : true;
      const matchesYear = filters.year ? film.year === Number(filters.year) : true;
      const matchesStatus = filters.status ? film.status === filters.status : true;
      return matchesSearch && matchesGenre && matchesYear && matchesStatus;
    });
  }, [films, filters]);

  return (
    <section>
      <header>
        <h1 className="page-title">Catalogo</h1>
        <p className="page-subtitle">
          Explore o acervo do Cremunaflix com filtros rapidos para encontrar
          experiencias perfeitas para cada sessao.
        </p>
      </header>
      <FilterBar
        search={filters.search}
        genre={filters.genre}
        year={filters.year}
        status={filters.status}
        genres={genres}
        years={years}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
      />
      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`catalog-skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((film) => (
            <FilmCard key={film.id} film={film} onSelect={setSelectedFilm} />
          ))}
        </div>
      )}
      <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
    </section>
  );
};

export default CatalogPage;
