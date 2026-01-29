# Cremunaflix Front

Interface estilo streaming para o acervo exibido em sessões de cinema no Discord. Feito em React + Vite + TypeScript, com suporte a mocks locais e integração com API REST (Salesforce Apex REST).

## Páginas
- Home (`/`) — destaques + carrosséis.
- Catálogo (`/catalogo`) — filtros por busca, gênero, ano e status.
- Sessões (`/sessoes`) — próximas e passadas.
- Pedidos (`/pedidos`) — formulário + lista de pedidos.

## Stack
- React 18 + Vite + TypeScript
- React Router com HashRouter (compatível com GitHub Pages)
- Tailwind CSS + CSS global

## Arquitetura (alto nível)
Fluxo principal:
`UI (pages/components)` → `domain (repositories/adapters)` → `services/api (ApiClient + adapters)` → `api/http.ts` (fetch wrapper)

Pastas principais:
```
src/
  app/             # shell da aplicação
  routes/          # rotas do SPA
  ui/              # pages e componentes
  domain/          # regras, adapters e repositórios
  services/api/    # ApiClient + adapters (Mock/HTTP) [ativo]
  api/             # fetch + services (endpoints)
  contracts/       # contratos usados pela UI
  mocks/           # dados locais
  styles/          # CSS global
```

Nota: existe uma pasta `src/services/` (sem `/api`) com arquivos legados não usados no fluxo atual.

## Rodando localmente
```bash
npm install
npm run dev
```

## Configuração por env
Variáveis suportadas (Vite):
- `VITE_USE_MOCK` — `false` para usar API real. Qualquer outro valor usa mocks.
- `VITE_API_BASE_URL` — base da API (sem barra final), ex:
  `https://example.salesforce.com/services/apexrest`
- `VITE_SF_API_BASE_URL` — alias opcional para o mesmo valor.
- `VITE_API_PROXY_TARGET` — alvo do proxy no dev (sem path), ex:
  `https://example.salesforce.com`
- `VITE_API_PROXY_PREFIX` — prefixo do proxy (default: `/services/apexrest`).
- `VITE_BASE` — base do Vite em build (ex.: `/cremunaflix-front/`).
- `GITHUB_PAGES=true` — ajusta a base automaticamente no build.

Fallback: se nenhuma base for informada, o client usa o `import.meta.env.BASE_URL` do app (útil para API no mesmo domínio do front).

## API real (sem CORS no localhost)
Use o proxy do Vite:
```bash
VITE_USE_MOCK=false \
VITE_API_BASE_URL=/services/apexrest \
VITE_API_PROXY_TARGET=https://example.salesforce.com \
VITE_API_PROXY_PREFIX=/services/apexrest \
npm run dev
```

## API real (direto, sem proxy)
```bash
VITE_USE_MOCK=false \
VITE_API_BASE_URL=https://example.salesforce.com/services/apexrest \
npm run dev
```

Se aparecer erro de CORS, configure o Allowed Origin no Salesforce (ex.: `http://localhost:5173`).

## Build e preview
```bash
npm run build
npm run preview
```

Build simulando GitHub Pages:
```bash
GITHUB_PAGES=true VITE_BASE=/cremunaflix-front/ npm run build
```

## Deploy no GitHub Pages
O workflow em `.github/workflows/deploy.yml` publica ao fazer push na branch `main`.

Passos:
1. Em Settings → Pages, selecione GitHub Actions.
2. Defina as envs como **Secrets** ou **Variables**:
   - `VITE_API_BASE_URL` (ou `VITE_SF_API_BASE_URL`)
3. Faça push na `main` e aguarde o workflow.

Diagnóstico rápido:
- O HTML servido deve referenciar `/cremunaflix-front/assets/...`.
- Se carregar `/src/main.tsx`, o Pages está apontando para o branch, não para o build.

## Endpoints esperados
- Home: `GET /api/v1/home`
- Catálogo: `GET /api/v1/movies`
- Sessões: `GET /api/v1/sessions?scope=upcoming|past`
- Pedidos: `GET /api/v1/requests`
- Criar pedido: `POST /api/v1/requests` (exige `requestedById`)

Contratos principais:
- `src/contracts/*` (UI)
- `src/types/dtos.ts` (DTOs atuais)

## Notas de styling
Tailwind está ativo com CSS global em `src/styles/global.css`. A migração é incremental, então alguns componentes ainda dependem de classes globais.

