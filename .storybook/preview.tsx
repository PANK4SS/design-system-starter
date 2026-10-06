import { useEffect, useState, type PropsWithChildren } from 'react';
import type { Preview } from '@storybook/react-vite';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { darkTheme, lightTheme } from './theme';

// Les tokens générés par `npm run build:tokens`
import '../dist/web/css/light.css';
import '../dist/web/css/dark.css';
import './preview.css';

type Theme = 'light' | 'dark';

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

// La page Docs a son propre thème : on la fait suivre l'attribut data-theme posé par le décorateur.
function ThemedDocsContainer({ children, ...props }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <DocsContainer {...props} theme={theme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </DocsContainer>
  );
}

const preview: Preview = {
  // Bouton « Thème » dans la barre d'outils de Storybook
  globalTypes: {
    theme: {
      description: 'Thème',
      toolbar: {
        title: 'Thème',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Clair', icon: 'sun' },
          { value: 'dark', title: 'Sombre', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },

  decorators: [
    (Story, context) => {
      // data-theme doit être posé sur <html> : les component tokens sont déclarés sur :root
      document.documentElement.dataset.theme = context.globals.theme;
      return <Story />;
    },
  ],

  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    docs: { container: ThemedDocsContainer },
  },

  tags: ['autodocs'], // une page « Docs » automatique pour chaque composant
};

export default preview;
