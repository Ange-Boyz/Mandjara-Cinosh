import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Injects a strict Content-Security-Policy <meta> in production builds only
 * (the dev server needs inline scripts for HMR). The same policy is also
 * shipped as real HTTP headers in public/_headers and vercel.json, which is
 * the preferred enforcement point (meta CSP cannot set frame-ancestors).
 */
function cspPlugin(apiOrigin) {
  return {
    name: 'mandjara-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const connect = ["'self'", apiOrigin].filter(Boolean).join(' ');
      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        `connect-src ${connect}`,
        "frame-src https://www.openstreetmap.org",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ');
      return html.replace(
        '<!--CSP-->',
        `<meta http-equiv="Content-Security-Policy" content="${csp}" />`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let apiOrigin = '';
  try {
    if (env.VITE_API_BASE_URL) apiOrigin = new URL(env.VITE_API_BASE_URL).origin;
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid absolute URL (https://…)');
  }

  return {
    plugins: [react(), cspPlugin(apiOrigin)],
    build: {
      target: 'es2019',
      sourcemap: false, // never ship source maps to production
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  };
});
