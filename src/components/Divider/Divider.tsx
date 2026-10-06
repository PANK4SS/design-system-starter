import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  /** `horizontal` entre deux blocs, `vertical` entre deux éléments sur une même ligne. */
  orientation?: DividerOrientation;
  /** Texte centré sur le trait (« ou », « Hier »…). Uniquement en horizontal. */
  label?: ReactNode;
  /** Espace autour du trait. */
  spacing?: DividerSpacing;
}

/**
 * Sépare visuellement deux groupes de contenus.
 * Sans libellé : un `<hr>` natif. Avec libellé ou en vertical : `role="separator"`.
 */
export function Divider({ orientation = 'horizontal', label, spacing = 'md', className, ...rest }: DividerProps) {
  const spacingClass = styles[`spacing-${spacing}`];

  if (orientation === 'vertical') {
    return (
      <div
        {...rest}
        role="separator"
        aria-orientation="vertical"
        className={cx(styles.vertical, spacingClass, className)}
      />
    );
  }

  if (label) {
    return (
      <div
        {...rest}
        role="separator"
        aria-orientation="horizontal"
        // Les enfants d'un separator sont ignorés par les lecteurs d'écran : on reporte le texte en nom accessible
        aria-label={typeof label === 'string' ? label : rest['aria-label']}
        className={cx(styles.labelled, spacingClass, className)}
      >
        <span className={styles.label}>{label}</span>
      </div>
    );
  }

  return <hr {...rest} className={cx(styles.horizontal, spacingClass, className)} />;
}
