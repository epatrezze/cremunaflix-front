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

## Rodando localmente
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy no GitHub Pages
O workflow em `.github/workflows/deploy.yml` publica automaticamente ao fazer push na branch `main`.

Passos:
1. Habilite GitHub Pages em Settings > Pages e selecione GitHub Actions.
2. Faca push para a branch `main`.
3. Aguarde o workflow finalizar.

## Alternar Mock / API
O projeto usa mocks por padrao. Para alternar:

```bash
VITE_USE_MOCK=false npm run dev
```

A implementacao futura da API deve ser feita em `src/services/adapters/HttpAdapter.ts` seguindo o contrato em `src/contracts`.
