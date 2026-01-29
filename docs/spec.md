# Spec — Integracao Salesforce API (Cremunaflix Front)

## 1. Objetivo e escopo
Integrar o front (React + Vite + TS) com a API REST publica do Salesforce via `fetch`, mantendo o layout atual e o fluxo de loading/erro ja existente. A integracao deve substituir os mocks quando `VITE_USE_MOCK=false`, usando `VITE_SF_API_BASE_URL` como base. Sem novas libs.

Escopo:
- Consumir endpoints `/api/v1/home`, `/api/v1/movies`, `/api/v1/sessions`, `/api/v1/requests`.
- Padronizar headers e tratamento de erro (ErrorDTO).
- Atualizar env/README.
- Preservar mocks como fallback opcional.

Fora de escopo:
- Refatoracoes visuais.
- Mudancas profundas de UX.
- Otimizacoes de cache complexas.

## 2. Mapa do projeto (pastas relevantes + onde estao os mocks/dados atuais)
Pastas/arquivos chave:
- `src/ui/pages/` — paginas Home/Catalogo/Sessoes/Pedidos (uso direto de repositorios + `useState/useEffect`).
- `src/domain/repositories/` — repositorios que chamam `apiClient` e fazem adaptacao.
- `src/domain/movieAdapter.ts` — mapeia `Movie` (API) -> `Film` (UI).
- `src/contracts/` — contratos atuais (`movie`, `film`, `session`, `request`, `pagination`, `api.v1`).
- `src/services/api/` — camada de API **ativa** (ApiClient + adapters Mock/HTTP).
- `src/mocks/` — dados mock (`movies`, `films`, `sessions`, `requests`).
- `src/services/ApiClient.ts` + `src/services/adapters/*` + `src/services/apiClient.ts` — **legado/nao usado** hoje (manter observado).
- `docs/api-v1.md` — doc antiga (nao alinhada com endpoints Salesforce atuais).
- `.env.example` — contem `VITE_USE_MOCK` e `VITE_API_BASE_URL`.

Onde estao os mocks:
- `src/mocks/movies.ts` (lista Movie)
- `src/mocks/films.ts` (adapta movies -> Film)
- `src/mocks/sessions.ts`
- `src/mocks/requests.ts`
- `src/mocks/index.ts` (exporta todos)
- `src/services/api/adapters/MockAdapter.ts` usa estes mocks.

Como o carregamento funciona hoje:
- Cada pagina usa `useState + useEffect` e chama repositorios (`catalogRepository`, `sessionsRepository`, `requestsRepository`).
- Loading/erro e retry sao feitos localmente na pagina.

## 3. Inventario de telas/rotas e suas dependencias de dados
Rotas em `src/routes/AppRoutes.tsx`:
- `/` (HomePage)
  - Dados: catalogo (filmes), sessoes futuras, pedidos recentes.
  - Fontes: `catalogRepository.getCatalog()`, `sessionsRepository.getUpcomingSessions()`, `requestsRepository.listRequests()`.
  - Usa: Hero + 2 carrosseis (ultimas exibidas, mais pedidos).

- `/catalogo` (CatalogPage)
  - Dados: catalogo paginado + lista completa p/ filtros (generos/anos).
  - Fonte: `catalogRepository.getCatalog({ pageSize: 200 })` para filtros e `getCatalog` com filtros ativos.

- `/sessoes` (SessionsPage)
  - Dados: sessoes futuras e passadas, + filmes para titulo.
  - Fonte: `catalogRepository.getCatalog()`, `sessionsRepository.getUpcomingSessions()`, `sessionsRepository.getPastSessions()`.

- `/pedidos` (RequestsPage)
  - Dados: lista de pedidos + envio de pedido.
  - Fonte: `requestsRepository.listRequests()`, `createRequestCommand.execute()` -> `requestsRepository.createRequest()`.

## 4. Contratos esperados (DTOs) e mapeamento UI → API
A UI consome **Film**, mas a integracao atual eh feita via **Movie** com adaptador. Campos minimos esperados para manter UI:

### MovieDTO (GET /api/v1/movies)
Campos minimos usados no UI/adapter:
- `id` (string)
- `title` ou `originalTitle`
- `overview`
- `releaseDate` ou `releaseYear`
- `runtimeMinutes`
- `certification`
- `status` (EXHIBITED | SCHEDULED | UPCOMING | ...)
- `genres` (array com `{ id, name }`)
- `metrics.voteAverage` (rating)
- `images.poster` e/ou `images.backdrop` (ou `posterUrl/backdropUrl` se vierem assim)

Mapeamento para `Film` (via `src/domain/movieAdapter.ts`):
- `Film.title` <- `Movie.title || Movie.originalTitle`
- `Film.year` <- `releaseYear` ou ano de `releaseDate`
- `Film.synopsis` <- `overview`
- `Film.rating` <- `metrics.voteAverage`
- `Film.status` <- Movie.status (EXHIBITED->SCREENED, SCHEDULED/UPCOMING->SCHEDULED)
- `Film.backdrop/poster` <- `images.backdrop/poster`
- `Film.genres` <- `genres[].name`

### SessionDTO (GET /api/v1/sessions?scope=...)
Campos minimos:
- `id`
- `filmId` (ou `movieId`)
- `startsAt` (ISO)
- `status` (UPCOMING | PAST | DONE | CANCELLED)
- `host`, `room`, `notes` (opcionais)

### RequestDTO (GET/POST /api/v1/requests)
Campos minimos:
- `id`
- `title`
- `link` (ou `posterUrl` / `movie.imdbUrl` como fallback)
- `reason` (ou `notes`)
- `status` (OPEN | APPROVED | DECLINED | PENDING | REJECTED | FULFILLED)
- `createdAt` (ou `requestedAt`)

### PaginatedResponse
Formato esperado no front:
```
{ items: T[]; page: number; pageSize: number; total: number }
```
Se a API retornar `pageInfo`, o adapter deve normalizar (ja existe em `HttpAdapter`).

### ErrorDTO
Backend retorna:
```
{ code: string; message: string; details?: string }
```
Front deve sempre exibir `message`.

### HomeResponse (GET /api/v1/home)
Contrato esperado pelo front hoje:
```
{
  hero: { title: string; items: SessionDTO[] } | null,
  lastExhibited: MovieSummaryDTO[],
  mostRequested: MovieSummaryDTO[]
}
```
Notas:
- `hero` pode ser omitido ou `null`.
- `items` em `hero` sao sessoes com `filmId`/`movieId` e `startsAt`.

## 5. Estrategia de integracao
### Config env
- Trocar base URL para `VITE_SF_API_BASE_URL` (Vite).
- Manter `VITE_USE_MOCK` para alternar Mock/HTTP.
- Atualizar `.env.example` e README.

### API client (fetch wrapper)
Requisitos:
- `credentials: "omit"`
- `Accept: application/json`
- `Content-Type: application/json` **apenas** quando houver `body`
- Tratamento de erro lendo ErrorDTO

Snippet proposto (curto):
```ts
const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'omit'
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw { code: body?.code ?? `HTTP_${res.status}`, message: body?.message ?? 'Request failed', details: body?.details };
  }

  return (await res.json()) as T;
};
```

### Services por dominio
Manter estrutura atual `src/services/api/`:
- `ApiClient` (contrato) deve refletir endpoints novos (adicionar `getHome` se usado).
- `HttpAdapter` implementa chamadas HTTP reais.
- `MockAdapter` segue espelho da API usando mocks atuais.

### Hooks (opcional) ou uso direto em paginas
Manter `useEffect` nas paginas (minimo impacto). Se criar hook, deve apenas encapsular `loading/error` sem alterar layout.

### Tratamento de erro e loading
- Preservar estado atual (loading local + mensagem).
- Exibir `error.message` vindo do ErrorDTO.
- Retry: manter `reloadToken` com botao de “tentar novamente”.

## 6. Plano de mudancas (lista de arquivos a criar/alterar)
Checklist sugerido:
- [ ] Atualizar env:
  - [ ] `.env.example` -> substituir `VITE_API_BASE_URL` por `VITE_SF_API_BASE_URL`.
  - [ ] README -> nova variavel e exemplo.
- [ ] Contratos:
  - [ ] Ajustar/confirmar `src/contracts/api.v1.ts` (ErrorDTO ok).
  - [ ] (Opcional) criar `src/contracts/home.ts` se `GET /api/v1/home` for usado.
- [ ] API client:
  - [ ] `src/services/api/ApiClient.ts` adicionar `getHome` e alinhar query params.
  - [ ] `src/services/api/adapters/HttpAdapter.ts`:
    - [ ] usar `VITE_SF_API_BASE_URL`.
    - [ ] incluir `credentials: 'omit'` e `Accept` header.
    - [ ] `Content-Type` so com body.
    - [ ] mapear endpoints novos (`/api/v1/movies`, `/api/v1/sessions`, `/api/v1/requests`, `/api/v1/home`).
  - [ ] `src/services/api/adapters/MockAdapter.ts` espelhar novas assinaturas.
- [ ] Repositorios:
  - [ ] `src/domain/repositories/catalog.repository.ts` — sem mudanca estrutural, apenas alinhar com novo adapter.
  - [ ] `src/domain/repositories/sessions.repository.ts` — alinhar query (scope/page/pageSize se usado).
  - [ ] `src/domain/repositories/requests.repository.ts` — alinhar sort/paginacao.
- [ ] Paginas:
  - [ ] `src/ui/pages/HomePage.tsx` — decidir entre `getHome()` ou chamadas separadas.
  - [ ] `src/ui/pages/CatalogPage.tsx` — validar filtros `genreId`, `status`, `year`, `query`.
  - [ ] `src/ui/pages/SessionsPage.tsx` — usar `scope=upcoming/past`.
  - [ ] `src/ui/pages/RequestsPage.tsx` — POST conforme payload Salesforce.
- [ ] Documentacao:
  - [ ] `docs/api-v1.md` atualizar para endpoints Salesforce (opcional, mas recomendado).

## 7. Criterios de aceite
- Com `VITE_USE_MOCK=false` e `VITE_SF_API_BASE_URL` valido:
  - Home carrega destaques/ultimas exibidas/mais pedidos.
  - Catalogo retorna itens com filtros (query, genero, status, ano).
  - Sessoes exibem proximas e passadas.
  - Pedidos listam e criam novo pedido via POST.
- Erros HTTP exibem `message` do ErrorDTO.
- Loading/Empty state mantem comportamento atual.
- Mock continua funcional quando `VITE_USE_MOCK=true`.

## 8. Riscos/observacoes
- **Contrato /home indefinido:** caso backend nao siga estrutura proposta, manter chamadas separadas para HomePage.
- **CORS:** Salesforce pode exigir configuracao de CORS/Remote Site Settings.
- **Base URL:** garantir sem barra final (`.../services/apexrest`) e evitar `//` ao montar path.
- **Diferencas de campos:** imagens e status podem vir com nomes diferentes; `HttpAdapter` ja normaliza (poster/backdrop, status).
- **Paginacao:** `movies` e `requests` esperam pagina; se backend retornar `pageInfo`, manter normalizacao.
- **Legacy services:** existem arquivos em `src/services/` (fora de `src/services/api`) nao usados; evitar mexer neles para nao introduzir regressao.

---

### Referencias rapidas (arquivos tocados com mais probabilidade)
- `src/services/api/ApiClient.ts`
- `src/services/api/adapters/HttpAdapter.ts`
- `src/services/api/adapters/MockAdapter.ts`
- `src/domain/repositories/*.ts`
- `src/ui/pages/*.tsx`
- `.env.example`
- `README.md`
- `docs/api-v1.md`
