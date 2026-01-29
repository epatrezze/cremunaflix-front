# Cremunaflix Front

Interface estilo streaming para o acervo exibido em sessoes de cinema no Discord. Este projeto usa React + Vite + TypeScript, com dados mockados e arquitetura pronta para trocar por uma API real.

## Stack
- React + Vite + TypeScript
- React Router com HashRouter (compatibilidade GitHub Pages)
- Dados mockados em `src/mocks`

## Estrutura
```
src/
  app/
  routes/
  ui/
    components/
    pages/
  domain/
  services/
  contracts/
  mocks/
  styles/
```

## Styling
Este projeto usa Tailwind CSS em conjunto com CSS global. As diretivas Tailwind estao em `src/styles/global.css`, que tambem concentra tokens e estilos custom. A migracao e incremental e alguns componentes ainda dependem das classes globais existentes.

## Rodando localmente
```bash
npm install
npm run dev
```

Nota: CI usa `npm ci`.

## Migracao incremental
- CSS global continua ativo para evitar regressao visual.
- Tailwind esta configurado e pode ser aplicado gradualmente em componentes novos ou existentes.

## Build
```bash
npm run build
npm run preview
```

## Validacao local (Pages)
Build normal:
```bash
npm run build
```

Build simulando GitHub Pages (ajusta base path):
```bash
GITHUB_PAGES=true VITE_BASE=/cremunaflix-front/ npm run build
```

Preview do build:
```bash
npm run preview
```

## Deploy no GitHub Pages
O workflow em `.github/workflows/deploy.yml` publica automaticamente ao fazer push na branch `main`.

Passos:
1. Habilite GitHub Pages em Settings > Pages e selecione GitHub Actions.
2. Faca push para a branch `main`.
3. Aguarde o workflow finalizar.

Observacao: o `vite.config.ts` calcula automaticamente o `base` usando o nome do repositorio no GitHub Actions. Se voce estiver fazendo build local para publicar manualmente, defina `VITE_BASE=/<nome-do-repo>/` antes de rodar o build.

Se o site aparecer em branco com erro de `src/main.tsx`, isso indica que o GitHub Pages ainda esta servindo o conteudo do branch em vez do build do workflow. Confirme a configuracao acima.

Checklist rapido de diagnostico:
1. Pages esta em Settings > Pages -> Source: GitHub Actions.
2. O deploy mais recente mostra artefato publicado (dist).
3. O HTML servido referencia `/cremunaflix-front/assets/...` em vez de `/src/main.tsx`.

## Alternar Mock / API
O projeto usa mocks por padrao. Para alternar:

```bash
VITE_USE_MOCK=false npm run dev
```

Configure `VITE_SF_API_BASE_URL` para apontar para o Salesforce Apex REST (placeholder em `.env.example`).
Copie `.env.example` para `.env` e ajuste os valores conforme necessario.

A implementacao da API HTTP esta em `src/api/http.ts` + `src/api/services/*`, com adaptacao em `src/services/api/adapters/HttpAdapter.ts` seguindo o contrato em `src/contracts/api.v1.ts`.

Documentacao do contrato: `docs/api-v1.md`.

Nota API-ready: defina `VITE_USE_MOCK=false` e `VITE_SF_API_BASE_URL` para usar o HttpAdapter sem alterar a UI.

Teste manual rapido (HTTP adapter):
```bash
VITE_USE_MOCK=false VITE_SF_API_BASE_URL=https://example.salesforce.com/services/apexrest npm run dev
```

## Endpoints por tela
- Home: `GET /api/v1/home` (ou fallback para `GET /api/v1/movies`, `GET /api/v1/sessions?scope=upcoming` e `GET /api/v1/requests`).
- Catalogo: `GET /api/v1/movies` com `query`, `status`, `year`, `genreId`, `page`, `pageSize`.
- Sessoes: `GET /api/v1/sessions?scope=upcoming` e `GET /api/v1/sessions?scope=past`.
- Pedidos: `GET /api/v1/requests` e `POST /api/v1/requests`.

Nota: flags v7 do React Router habilitadas para preparar upgrade.
