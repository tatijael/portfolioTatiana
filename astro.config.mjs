// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://tatianasaucedo.dev',
  // React solo se usa en islas (`client:visible`): las secciones animadas
  // portadas del storefront. El resto del sitio sigue siendo HTML estático
  // sin JS de framework.
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
