import { defineConfig, loadEnv } from 'vite';
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_PROXY_TARGET?.trim();
  const proxyPrefix = env.VITE_API_PROXY_PREFIX?.trim() || '/services/apexrest';

  return {
    plugins: [react()],
    base: resolveBase(),
    server: proxyTarget
      ? {
          proxy: {
            [proxyPrefix]: {
              target: proxyTarget,
              changeOrigin: true,
              secure: true
            }
          }
        }
      : undefined
  };
});
