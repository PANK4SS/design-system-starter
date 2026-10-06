import { useId, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './ProgressBar.module.css';

export type ProgressBarVariant = 'brand' | 'success' | 'danger';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Ce qui progresse : « Import des badges d'accès ». Affiché au-dessus de la barre et lu par les lecteurs d'écran. */
  label: string;
  /** Avancement entre 0 et `max`. Laisser vide si l'avancement est inconnu (barre indéterminée). */
  value?: number;
  /** Valeur correspondant à 100 %. */
  max?: number;
  /** Affiche la valeur à droite du libellé (« 45 % » par défaut). */
  showValue?: boolean;
  /** Texte de la valeur, à la place du pourcentage : « 18 fichiers sur 40 ». Aussi lu par les lecteurs d'écran. */
  valueText?: string;
  /** `brand` par défaut ; `success` quand c'est terminé ; `danger` quand l'opération a échoué. */
  variant?: ProgressBarVariant;
}

/**
 * Barre de progression. `role="progressbar"` avec `aria-valuenow/min/max` en mode déterminé ;
 * sans `aria-valuenow` en mode indéterminé (c'est ce que comprennent les lecteurs d'écran).
 * On n'utilise pas `<progress>` : son apparence est très difficile à styliser de façon identique partout.
 */
export function ProgressBar({
  label,
  value,
  max = 100,
  showValue = false,
  valueText,
  variant = 'brand',
  className,
  ...rest
}: ProgressBarProps) {
  const labelId = useId();
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const displayValue = valueText ?? `${percent} %`;

  return (
    <div {...rest} className={cx(styles.root, styles[variant], indeterminate && styles.indeterminate, className)}>
      <div className={styles.header}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {/* Déjà lu via aria-valuetext : masqué pour ne pas être annoncé deux fois */}
        {showValue && !indeterminate && (
          <span className={styles.value} aria-hidden="true">
            {displayValue}
          </span>
        )}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuetext={indeterminate ? undefined : displayValue}
      >
        <div className={styles.fill} style={indeterminate ? undefined : { width: `${percent}%` }} />
      </div>
    </div>
  );
}
