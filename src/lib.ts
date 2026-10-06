// Entrée du BUILD de la librairie (vite.lib.config.ts) : ajoute les tokens CSS au code des composants.
// Vite sort tout le CSS dans dist/lib/styles.css ; les apps l'importent une fois :
//   import 'design-system-starter/styles.css';
import './styles.css';

export * from './index';
