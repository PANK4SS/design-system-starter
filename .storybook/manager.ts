// Interface de Storybook (barre latérale, barre d'outils) : suit le bouton « Thème » de la barre d'outils,
// comme le canvas et les pages Docs. Une seule source de vérité : le global `theme`.
import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { darkTheme, lightTheme } from './theme';

const themeFor = (globals?: Record<string, unknown>) => (globals?.theme === 'dark' ? darkTheme : lightTheme);

// Thème au démarrage (le global `theme` vaut 'light' par défaut, voir preview.tsx)
addons.setConfig({ theme: lightTheme });

addons.register('design-system/theme-sync', (api) => {
  const apply = ({ globals }: { globals?: Record<string, unknown> }) => {
    api.setOptions({ theme: themeFor(globals) });
  };
  api.on(SET_GLOBALS, apply); // chargement de la page (y compris un thème mémorisé dans l'URL)
  api.on(GLOBALS_UPDATED, apply); // clic sur le bouton « Thème »
});
