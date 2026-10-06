import { cx } from '../../utils/cx';
import type { ResolvedSeries } from './series';
import styles from './Chart.module.css';

export interface ChartTooltipRow {
  series: ResolvedSeries;
  value: string;
}

export interface ChartTooltipProps {
  /** Catégorie survolée (ex. « Mars »). */
  heading: string;
  rows: ChartTooltipRow[];
  /** Ligne de total optionnelle (barres empilées). */
  total?: string;
  /** Point d'ancrage, en pixels, dans la zone du graphique. */
  x: number;
  y: number;
  /** Largeur de la zone : sert à garder l'infobulle à l'intérieur. */
  containerWidth: number;
  /** `above` : au-dessus du point (barres) ; `side` : à côté du réticule (lignes). */
  placement: 'above' | 'side';
}

/**
 * Infobulle du graphique. Elle n'est qu'un CONFORT : les mêmes valeurs sont lues par les
 * lecteurs d'écran (aria-label des zones) et visibles dans le tableau « Voir les données ».
 * Elle est donc masquée aux technologies d'assistance pour éviter une double lecture.
 */
export function ChartTooltip({ heading, rows, total, x, y, containerWidth, placement }: ChartTooltipProps) {
  // Position horizontale : on bascule à gauche/droite près des bords pour ne pas déborder
  const third = containerWidth / 3;
  let translateX = '-50%';
  let left = x;
  if (placement === 'side') {
    translateX = x > containerWidth / 2 ? 'calc(-100% - var(--space-3))' : 'var(--space-3)';
  } else if (x < third / 2) {
    translateX = 'calc(-1 * var(--space-3))';
  } else if (x > containerWidth - third / 2) {
    translateX = 'calc(-100% + var(--space-3))';
  }
  if (left < 0) left = 0;
  const translateY = placement === 'above' ? 'calc(-100% - var(--space-2))' : '0';

  return (
    <div
      className={styles.tooltip}
      aria-hidden="true"
      style={{ left, top: y, transform: `translate(${translateX}, ${translateY})` }}
    >
      <p className={styles.tooltipHeading}>{heading}</p>
      <ul className={styles.tooltipList}>
        {rows.map(({ series, value }) => (
          <li key={series.name} className={cx(styles.tooltipRow, styles[series.slot])}>
            {/* Clé en trait court, même pour les barres : à cette densité, un carré plein pèse trop */}
            <span className={styles.keyLine} />
            {/* La valeur passe en premier et en gras : le lecteur connaît déjà la série, il cherche le nombre */}
            <span className={styles.tooltipValue}>{value}</span>
            <span className={styles.tooltipName}>{series.name}</span>
          </li>
        ))}
      </ul>
      {total && (
        <p className={styles.tooltipTotal}>
          <span className={styles.tooltipValue}>{total}</span> au total
        </p>
      )}
    </div>
  );
}
