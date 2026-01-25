interface FilterBarProps {
  search: string;
  genre: string;
  year: string;
  status: string;
  genres: string[];
  years: number[];
  onChange: (next: {
    search?: string;
    genre?: string;
    year?: string;
    status?: string;
  }) => void;
}

const FilterBar = ({
  search,
  genre,
  year,
  status,
  genres,
  years,
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
        value={genre}
        onChange={(event) => onChange({ genre: event.target.value })}
        aria-label="Filtro de genero"
      >
        <option value="">Todos os generos</option>
        {genres.map((item) => (
          <option key={item} value={item}>
            {item}
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
  </div>
);

export default FilterBar;
