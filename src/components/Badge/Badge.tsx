import type { HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Badge.module.css';

export type BadgeVariant = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Sens du statut : `success` = tout va bien, `warning` = à surveiller, `danger` = problème. */
  variant?: BadgeVariant;
  /** `sm` dans un tableau dense, `md` partout ailleurs. */
  size?: BadgeSize;
  /** Icône Lucide affichée avant le texte. Décorative : le texte porte le sens. */
  icon?: LucideIcon;
}

/** Courte étiquette de statut, non interactive. */
export function Badge({ variant = 'neutral', size = 'md', icon, className, children, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx(styles.badge, styles[variant], styles[size], className)}>
      {icon && <Icon icon={icon} size="sm" className={styles.icon} />}
      {children}
    </span>
  );
}
