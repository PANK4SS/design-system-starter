/*
 * Petites fonctions d'échelle, écrites à la main (aucune bibliothèque de graphiques).
 * Toutes les valeurs ici sont des coordonnées SVG calculées, pas du style.
 */

/** Largeur moyenne d'un caractère des graduations (police « caption », 12px), pour estimer la place des textes. */
export const CHAR_WIDTH = 7;

/**
 * Graduations « rondes » de 0 à au moins `max` (0, 10, 20… ou 0, 200, 400…).
 * On vise environ `target` intervalles.
 */
export function niceTicks(max: number, target = 4): number[] {
  const safeMax = max > 0 ? max : 1;
  const rough = safeMax / target;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
  const top = Math.ceil(safeMax / step) * step;
  const ticks: number[] = [];
  // Arrondi pour éviter les 0.30000000000000004 des nombres à virgule
  for (let value = 0; value <= top + step / 2; value += step) ticks.push(Number(value.toPrecision(12)));
  return ticks;
}

/** Échelle linéaire : transforme une valeur du domaine [d0, d1] en coordonnée [r0, r1]. */
export function linearScale(d0: number, d1: number, r0: number, r1: number) {
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** Formatage par défaut : nombres à la française (« 1 284 », « 3,5 »). */
const frenchNumber = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
export const formatNumberFr = (value: number) => frenchNumber.format(value);

/** Espace minimal entre deux libellés de l'axe X : au-delà, on n'en affiche qu'un sur N. */
export function labelStep(labels: string[], band: number): number {
  const longest = Math.max(...labels.map((label) => label.length), 1);
  const needed = longest * CHAR_WIDTH + 12;
  return Math.max(1, Math.ceil(needed / Math.max(band, 1)));
}
