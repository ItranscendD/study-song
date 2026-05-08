import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        onboarding: resolve(__dirname, 'onboarding.html'),
        input: resolve(__dirname, 'input.html'),
        customize: resolve(__dirname, 'customize.html'),
        player: resolve(__dirname, 'player.html'),
        library: resolve(__dirname, 'library.html'),
        study: resolve(__dirname, 'study.html'),
        export: resolve(__dirname, 'export.html'),
        achievements: resolve(__dirname, 'achievements.html'),
        settings: resolve(__dirname, 'settings.html'),
        paywall: resolve(__dirname, 'paywall.html'),
        search: resolve(__dirname, 'search.html'),
        modalRegenerate: resolve(__dirname, 'modal-regenerate.html'),
        emptyHome: resolve(__dirname, 'empty-home.html'),
        emptyLibrary: resolve(__dirname, 'empty-library.html'),
        errorGeneration: resolve(__dirname, 'error-generation.html'),
        errorUpload: resolve(__dirname, 'error-upload.html'),
      },
    },
  },
  server: {
    open: '/index.html',
  },
});
