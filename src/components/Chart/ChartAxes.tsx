import { CHAR_WIDTH, labelStep } from './scale';
import styles from './Chart.module.css';

export interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Marge gauche nécessaire pour les graduations de l'axe Y (estimée d'après le plus long libellé). */
export function yAxisWidth(tickLabels: string[]) {
  const longest = Math.max(...tickLabels.map((label) => label.length), 1);
  return longest * CHAR_WIDTH + 12;
}

interface YGridProps {
  ticks: number[];
  y: (value: number) => number;
  margins: ChartMargins;
  width: number;
  format: (value: number) => string;
}

/** Lignes de grille horizontales (traits fins, pleins, discrets) et graduations de l'axe Y. */
export function YGrid({ ticks, y, margins, width, format }: YGridProps) {
  return (
    <g aria-hidden="true">
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            className={tick === 0 ? styles.baseline : styles.grid}
            x1={margins.left}
            x2={width - margins.right}
            y1={y(tick)}
            y2={y(tick)}
          />
          <text className={styles.tick} x={margins.left - 8} y={y(tick)} dy="0.32em" textAnchor="end">
            {format(tick)}
          </text>
        </g>
      ))}
    </g>
  );
}

interface XLabelsProps {
  categories: string[];
  /** Abscisse du centre de chaque catégorie. */
  x: (index: number) => number;
  /** Largeur disponible par catégorie : sert à éclaircir les libellés quand ils ne tiennent pas. */
  band: number;
  baseline: number;
}

/** Libellés de l'axe X. Si la place manque, on n'en affiche qu'un sur N plutôt que de les superposer. */
export function XLabels({ categories, x, band, baseline }: XLabelsProps) {
  const step = labelStep(categories, band);
  return (
    <g aria-hidden="true">
      {categories.map((category, index) =>
        index % step === 0 ? (
          <text key={category} className={styles.tick} x={x(index)} y={baseline + 18} textAnchor="middle">
            {category}
          </text>
        ) : null,
      )}
    </g>
  );
}
