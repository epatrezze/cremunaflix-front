/**
 * Props for FilterBar component.
 */
interface FilterBarProps {
  search: string;
  genreId: string;
  year: string;
  status: string;
  genres: { value: string; label: string }[];
  years: number[];
  showReset?: boolean;
  onReset?: () => void;
  onChange: (next: {
    search?: string;
    genreId?: string;
    year?: string;
    status?: string;
  }) => void;
}

/**
 * Filter controls for catalog search and facets.
 *
 * @param props - Filter bar props.
 * @returns Filter bar element.
 */
const FilterBar = ({
  search,
  genreId,
  year,
  status,
  genres,
  years,
  showReset,
  onReset,
  onChange
}: FilterBarProps) => (
  <div className="filter-bar">
    <label>
      <span className="sr-only">Buscar</span>
      <input
        type="search"
        value={search}
        onChange={(event) => onChange({ search: event.target.value })}
        placeholder="Buscar por titulo"
        aria-label="Buscar por titulo"
      />
    </label>
    <label>
      <span className="sr-only">Genero</span>
      <select
        value={genreId}
        onChange={(event) => onChange({ genreId: event.target.value })}
        aria-label="Filtro de genero"
      >
        <option value="">Todos os generos</option>
        {genres.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
    <label>
      <span className="sr-only">Ano</span>
      <select
        value={year}
        onChange={(event) => onChange({ year: event.target.value })}
        aria-label="Filtro de ano"
      >
        <option value="">Todos os anos</option>
        {years.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
    <label>
      <span className="sr-only">Status</span>
      <select
        value={status}
        onChange={(event) => onChange({ status: event.target.value })}
        aria-label="Filtro de status"
      >
        <option value="">Exibidos e agendados</option>
        <option value="SCREENED">Exibidos</option>
        <option value="SCHEDULED">Agendados</option>
      </select>
    </label>
    {showReset && onReset && (
      <button className="button-ghost filter-reset" type="button" onClick={onReset}>
        Limpar filtros
      </button>
    )}
  </div>
);

export default FilterBar;
