import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Forme : `text` = lignes de texte, `circle` = avatar, `rect` = image ou bloc. */
  variant?: SkeletonVariant;
  /** Nombre de lignes (variante `text`). La dernière est plus courte, comme un vrai paragraphe. */
  lines?: number;
  /** Largeur CSS, idéalement un token : `var(--space-16)`, `100%`… */
  width?: string;
  /** Hauteur CSS (variante `rect`), idéalement un token. */
  height?: string;
}

/**
 * Silhouette grise qui annonce la forme d'un contenu en cours de chargement.
 * Toujours `aria-hidden` : c'est au conteneur de signaler le chargement (`aria-busy="true"`)
 * ou à un `Spinner` voisin d'annoncer « Chargement… ».
 */
export function Skeleton({ variant = 'text', lines = 1, width, height, className, style, ...rest }: SkeletonProps) {
  const sizeStyle = { ...style, '--_width': width, '--_height': height } as CSSProperties;

  if (variant === 'text') {
    return (
      <span {...rest} aria-hidden="true" className={cx(styles.lines, className)} style={sizeStyle}>
        {Array.from({ length: Math.max(1, lines) }, (_, index) => (
          <span key={index} className={cx(styles.skeleton, styles.text)} />
        ))}
      </span>
    );
  }

  return <span {...rest} aria-hidden="true" className={cx(styles.skeleton, styles[variant], className)} style={sizeStyle} />;
}
