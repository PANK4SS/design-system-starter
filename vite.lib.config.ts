// Build de la LIBRAIRIE (ce que les apps installent). Storybook a sa propre config.
import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  css: {
    modules: {
      // Noms de classes lisibles dans l'app qui utilise le design system : ds-Button__primary-1a2b3
      generateScopedName: (local, file) => {
        const component = basename(file).replace(/\.module\.css$/, '');
        const hash = createHash('sha1').update(file + local).digest('hex').slice(0, 5);
        return `ds-${component}__${local}-${hash}`;
      },
    },
  },
  build: {
    outDir: 'dist/lib',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: 'src/lib.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles', // un seul fichier CSS : tokens + styles des composants
    },
    rolldownOptions: {
      // Fournis par l'app (peerDependencies) : on ne les embarque pas, sinon React serait en double.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^lucide-react($|\/)/],
    },
  },
});
