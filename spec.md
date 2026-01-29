# API Consumption Readiness Report

## 1) Contexto e Escopo
- Avaliacao do front React + Vite + TypeScript frente ao contrato REST em `/services/apexrest/api/v1/...`.
- Foco nos fluxos Home, Catalogo (Movies), Sessoes (Sessions) e Pedidos (Requests).
- Verificacao de client HTTP, headers, tratamento de erros, DTOs, paginacao e uso correto de rotas.

## 2) Cobertura Atual do Projeto
| Rota | Existe consumo? | Onde | Compatível? | Observações |
| --- | --- | --- | --- | --- |
| GET /api/v1/home | Nao | `src/api/services/home.ts` existe, mas nao usado; `src/ui/pages/HomePage.tsx` usa 3 endpoints separados via repositorios | Incompatível | Contrato exige `{ hero, lastExhibited, mostRequested }`; fluxo atual nao chama `/home`. |
| GET /api/v1/movies | Sim | `src/services/api/adapters/HttpAdapter.ts#getCatalog` -> `src/api/services/movies.ts#listMovies`, usado por `HomePage`, `CatalogPage`, `SessionsPage` via `catalogRepository` | Parcial | `CatalogPage` usa `pageSize: 200` (`src/ui/pages/CatalogPage.tsx`) acima do max 100; mapeamento de status `SCREENED/SCHEDULED` -> `EXHIBITED/UPCOMING` pode divergir do contrato; headers Content-Type nao sao enviados em GET. |
| GET /api/v1/sessions | Sim | `src/services/api/adapters/HttpAdapter.ts#getUpcomingSessions/getPastSessions` -> `src/api/services/sessions.ts#listSessions`, usado por `HomePage` e `SessionsPage` | Parcial | Contrato exige PagedResponseDTO com `pageInfo`; fluxo atual descarta metadados e nao usa `page/pageSize`, entao pode consumir apenas pagina default. |
| GET /api/v1/requests | Sim | `src/services/api/adapters/HttpAdapter.ts#listRequests` -> `src/api/services/requests.ts#listRequests`, usado por `HomePage` e `RequestsPage` | Parcial | Paginacao nao exposta na UI; sort default depende do backend; headers Content-Type nao sao enviados em GET. |
| POST /api/v1/requests | Sim | `src/services/api/adapters/HttpAdapter.ts#createRequest` -> `src/api/services/requests.ts#createRequest` via `createRequestCommand` | Incompatível | Payload atual envia `{ title, notes, posterUrl }` e nao inclui `requestedById` exigido quando nao ha usuario logado. |

## 3) Gaps Criticos
P0
- Home nao consome `/api/v1/home`; contrato exige resposta `hero/lastExhibited/mostRequested` e fluxo atual nao usa esse endpoint (`src/ui/pages/HomePage.tsx`).
- POST /api/v1/requests nao segue RequestCreateDTO do contrato; falta `requestedById` quando nao existe auth (`src/services/api/adapters/HttpAdapter.ts#createRequest`).
- `pageSize` acima do max 100 no catalogo (`src/ui/pages/CatalogPage.tsx` usa 200).

P1
- Tipos/DTOs nao estao 1:1 com o contrato: falta `MovieSummaryDTO` e `RequestCreateDTO` e os DTOs atuais sao permissivos (campos opcionais) em `src/types/dtos.ts`.
- Headers: `Content-Type: application/json` nao e enviado em GET (`src/api/http.ts`), enquanto o contrato exige ambos headers.
- Paginacao em sessions/requests nao e controlada pela UI; pode consumir apenas a primeira pagina por default.

P2
- Mapeamento de `status` (UI `SCREENED/SCHEDULED`) para API `EXHIBITED/UPCOMING` pode ser divergente do contrato e precisa confirmacao (`src/services/api/adapters/HttpAdapter.ts`).

## 4) Mudancas Necessarias
- [ ] Ajustar Home para consumir `GET /api/v1/home` e mapear `hero`, `lastExhibited`, `mostRequested` para a UI (`src/ui/pages/HomePage.tsx` e repositorios associados).
- [ ] Criar/ajustar DTOs 1:1 com contrato em `src/types/dtos.ts` incluindo `MovieSummaryDTO` e `RequestCreateDTO` (com `requestedById` quando nao houver auth).
- [ ] Adequar o payload do POST `/api/v1/requests` ao RequestCreateDTO do contrato (`src/services/api/adapters/HttpAdapter.ts#createRequest`).
- [ ] Restringir `pageSize` ao max 100 e revisar uso de paginacao em `CatalogPage`, `SessionsPage`, `RequestsPage`.
- [ ] Garantir envio de `Content-Type: application/json` e `Accept: application/json` em todas as chamadas, inclusive GET, conforme contrato (`src/api/http.ts`).
- [ ] Validar enums de `status` e `sort` usados no front com os definidos no contrato; ajustar `FilterBar` e mapeamentos no adapter se necessario.

## 5) Decisoes em Aberto
- Como obter/preencher `requestedById` quando nao houver usuario autenticado (sem fluxo de auth no projeto). Esta decisao bloqueia o POST conforme contrato.
