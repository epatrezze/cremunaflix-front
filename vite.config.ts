import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const resolveBase = () => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (process.env.VITE_BASE) {
    return process.env.VITE_BASE;
  }
  if (process.env.GITHUB_PAGES === 'true' && repo) {
    return `/${repo}/`;
  }
  return '/';
};

export default defineConfig({
  plugins: [react()],
  base: resolveBase(),
});
