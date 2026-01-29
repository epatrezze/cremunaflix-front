import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Film, FilmStatus, Movie } from '../../contracts';
import { catalogRepository } from '../../domain/repositories/catalog.repository';
import { apiClient } from '../../services';
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
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('query') ?? '',
    genreId: searchParams.get('genreId') ?? '',
    year: searchParams.get('year') ?? '',
    status: searchParams.get('status') ?? ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const handleRetry = () => setReloadToken((prev) => prev + 1);

  const areFiltersEqual = (next: typeof filters) =>
    next.search === filters.search &&
    next.genreId === filters.genreId &&
    next.year === filters.year &&
    next.status === filters.status;

  useEffect(() => {
    const nextFilters = {
      search: searchParams.get('query') ?? '',
      genreId: searchParams.get('genreId') ?? '',
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
    if (filters.genreId) params.set('genreId', filters.genreId);
    if (filters.year) params.set('year', filters.year);
    if (filters.status) params.set('status', filters.status);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters.genreId, filters.year, filters.status, setSearchParams]);

  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        const data = await apiClient.getCatalog({ pageSize: 100 });
        if (mounted) {
          setAllMovies(data.items);
        }
      } catch {
        if (mounted) {
          setAllMovies([]);
        }
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, [reloadToken]);

  const genres = useMemo(() => {
    const map = new Map<string, string>();
    allMovies.forEach((movie) => {
      movie.genres?.forEach((genre) => {
        if (!genre?.id || !genre.name) {
          return;
        }
        map.set(String(genre.id), genre.name);
      });
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allMovies]);

  const years = useMemo(() => {
    const set = new Set<number>();
    allMovies.forEach((movie) => {
      const year = movie.releaseYear ?? (movie.releaseDate ? Number(movie.releaseDate.slice(0, 4)) : null);
      if (year && !Number.isNaN(year)) {
        set.add(year);
      }
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [allMovies]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await catalogRepository.getCatalog({
          query: debouncedSearch || undefined,
          genreId: filters.genreId || undefined,
          year: filters.year ? Number(filters.year) : undefined,
          status: (filters.status || undefined) as FilmStatus | undefined,
          page: 1,
          pageSize: 50
        });
        if (mounted) {
          setFilms(data.items);
        }
      } catch (err) {
        if (mounted) {
          const message =
            err && typeof err === 'object' && 'message' in err
              ? String((err as { message: string }).message)
              : 'Nao foi possivel carregar o catalogo.';
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
  }, [debouncedSearch, filters.genreId, filters.year, filters.status, reloadToken]);

  const handleResetFilters = () => {
    const cleared = { search: '', genreId: '', year: '', status: '' };
    setFilters(cleared);
    setDebouncedSearch('');
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.genreId || filters.year || filters.status
  );

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
        genreId={filters.genreId}
        year={filters.year}
        status={filters.status}
        genres={genres}
        years={years}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        showReset={hasActiveFilters}
        onReset={handleResetFilters}
      />
      {!loading && !error && (
        <p className="page-subtitle">Resultados: {films.length}</p>
      )}
      {loading ? (
        <SkeletonGrid count={8} />
      ) : error ? (
        <EmptyState
          title="Falha ao carregar"
          description={error}
          actionLabel="Tentar novamente"
          onAction={handleRetry}
        />
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
