import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Film, FilmStatus } from '../../contracts';
import { catalogRepository } from '../../domain/repositories/catalog.repository';
import FilterBar from '../components/FilterBar';
import FilmCard from '../components/FilmCard';
import FilmModal from '../components/FilmModal';
import SkeletonGrid from '../components/SkeletonGrid';
import EmptyState from '../components/EmptyState';

/**
 * Catalog page with filters and film grid.
 *
 * @returns Catalog page section.
 */
const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [films, setFilms] = useState<Film[]>([]);
  const [allFilms, setAllFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('query') ?? '',
    genre: searchParams.get('genre') ?? '',
    year: searchParams.get('year') ?? '',
    status: searchParams.get('status') ?? ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const areFiltersEqual = (next: typeof filters) =>
    next.search === filters.search &&
    next.genre === filters.genre &&
    next.year === filters.year &&
    next.status === filters.status;

  useEffect(() => {
    const nextFilters = {
      search: searchParams.get('query') ?? '',
      genre: searchParams.get('genre') ?? '',
      year: searchParams.get('year') ?? '',
      status: searchParams.get('status') ?? ''
    };
    if (!areFiltersEqual(nextFilters)) {
      setFilters(nextFilters);
    }
  }, [searchParams]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [filters.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('query', debouncedSearch);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.year) params.set('year', filters.year);
    if (filters.status) params.set('status', filters.status);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters.genre, filters.year, filters.status, setSearchParams]);

  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      const data = await catalogRepository.getCatalog({ pageSize: 200 });
      if (mounted) {
        setAllFilms(data.items);
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const genres = useMemo(() => {
    const set = new Set<string>();
    allFilms.forEach((film) => film.genres.forEach((genre) => set.add(genre)));
    return Array.from(set).sort();
  }, [allFilms]);

  const years = useMemo(() => {
    const set = new Set<number>();
    allFilms.forEach((film) => set.add(film.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [allFilms]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await catalogRepository.getCatalog({
        query: debouncedSearch || undefined,
        genre: filters.genre || undefined,
        year: filters.year ? Number(filters.year) : undefined,
        status: (filters.status || undefined) as FilmStatus | undefined,
        page: 1,
        pageSize: 50
      });
      if (mounted) {
        setFilms(data.items);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch, filters.genre, filters.year, filters.status]);

  const handleResetFilters = () => {
    const cleared = { search: '', genre: '', year: '', status: '' };
    setFilters(cleared);
    setDebouncedSearch('');
  };

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
        <SkeletonGrid count={8} />
      ) : films.length === 0 ? (
        <EmptyState
          title="Nenhum filme encontrado"
          description="Ajuste sua busca ou limpe os filtros para ver mais resultados."
          actionLabel="Limpar filtros"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} onSelect={setSelectedFilm} />
          ))}
        </div>
      )}
      <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
    </section>
  );
};

export default CatalogPage;
