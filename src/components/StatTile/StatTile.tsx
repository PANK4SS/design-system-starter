import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './StatTile.module.css';
import a11y from '../../utils/visuallyHidden.module.css';

export type StatTileDeltaDirection = 'up' | 'down' | 'flat';
/** Lecture de l'évolution : une hausse des incidents est `negative`, une hausse des rondes est `positive`. */
export type StatTileDeltaTone = 'positive' | 'negative' | 'neutral';

export interface StatTileDelta {
  /** Évolution affichée, déjà formatée et signée (ex. `+12 %`, `−3`). */
  value: string;
  /** Sens de l'évolution : donne l'icône et le texte lu (« en hausse », « en baisse », « stable »). */
  direction: StatTileDeltaDirection;
  /**
   * Bonne ou mauvaise nouvelle : donne la couleur. Par défaut `neutral` (couleur de texte secondaire),
   * car le composant ne peut pas savoir si une hausse est souhaitable.
   */
  tone?: StatTileDeltaTone;
  /** Période de comparaison, toujours nommée (ex. `vs septembre`). */
  period?: string;
}

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  /** Ce que mesure l'indicateur, en casse de phrase et sans deux-points (ex. `Incidents ouverts`). */
  label: ReactNode;
  /** La valeur, déjà formatée (ex. `1 284`, `98,6 %`). */
  value: ReactNode;
  /** Évolution par rapport à une période nommée. */
  delta?: StatTileDelta;
  /** Texte d'aide sous la valeur (source, périmètre, date de mise à jour…). */
  helperText?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const directionIcons = { up: TrendingUp, down: TrendingDown, flat: Minus } as const;
// Le sens est dit en toutes lettres : la couleur seule ne suffit jamais (WCAG 1.4.1).
const directionLabels = { up: 'En hausse', down: 'En baisse', flat: 'Stable' } as const;

/**
 * Tuile d'indicateur clé (KPI) : un libellé, une grande valeur, et en option une évolution
 * (icône + texte, jamais la couleur seule) et un texte d'aide.
 */
export function StatTile({ label, value, delta, helperText, className, ref, ...rest }: StatTileProps) {
  return (
    <div {...rest} ref={ref} className={cx(styles.tile, className)}>
      {/* Une liste de description associe le libellé à sa valeur pour les lecteurs d'écran */}
      <dl className={styles.list}>
        <dt className={styles.label}>{label}</dt>
        <dd className={styles.value}>{value}</dd>
        {delta && (
          <dd className={cx(styles.delta, styles[delta.tone ?? 'neutral'])}>
            <Icon icon={directionIcons[delta.direction]} size="sm" stroke="bold" />
            <span className={a11y.visuallyHidden}>{directionLabels[delta.direction]} :</span>
            <span className={styles.deltaValue}>{delta.value}</span>
            {delta.period && <span className={styles.period}>{delta.period}</span>}
          </dd>
        )}
        {helperText && <dd className={styles.helper}>{helperText}</dd>}
      </dl>
    </div>
  );
}
