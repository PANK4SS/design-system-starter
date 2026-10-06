import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Taille, alignée sur les tailles d'icônes. */
  size?: SpinnerSize;
  /** Ce qui est en train de charger, lu par les lecteurs d'écran. Soyez précis : « Chargement des rondes… ». */
  label?: string;
  /** Affiche aussi le libellé à l'écran, à côté du cercle. */
  showLabel?: boolean;
}

/**
 * Indicateur de chargement de durée inconnue.
 * `role="status"` : le libellé est annoncé poliment, sans interrompre l'utilisateur.
 * La couleur suit le texte autour (`currentColor`).
 */
export function Spinner({ size = 'md', label = 'Chargement…', showLabel = false, className, ...rest }: SpinnerProps) {
  return (
    <span {...rest} role="status" className={cx(styles.spinner, styles[size], className)}>
      <span className={styles.circle} aria-hidden="true" />
      <span className={showLabel ? styles.label : styles.srOnly}>{label}</span>
    </span>
  );
}
