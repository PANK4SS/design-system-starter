// Interface de Storybook (barre latérale, barre d'outils) : suit le réglage clair/sombre du système.
import { addons } from 'storybook/manager-api';
import { darkTheme, lightTheme } from './theme';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({ theme: prefersDark ? darkTheme : lightTheme });
