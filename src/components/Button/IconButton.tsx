import type { LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import { Button, type ButtonProps } from './Button';
import styles from './Button.module.css';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> {
  /** Le dessin, importé depuis `lucide-react`. */
  icon: LucideIcon;
  /**
   * Obligatoire : sans texte visible, c'est le seul moyen pour un lecteur d'écran de savoir
   * à quoi sert le bouton (« Fermer », « Supprimer l'alerte »…).
   */
  label: string;
}

/** Bouton carré qui ne contient qu'une icône. Mêmes variantes, tailles et états que Button. */
export function IconButton({ icon, label, variant = 'ghost', size = 'md', className, ...rest }: IconButtonProps) {
  return (
    <Button {...rest} variant={variant} size={size} aria-label={label} className={cx(styles.iconOnly, className)}>
      <Icon icon={icon} size={size === 'lg' ? 'lg' : 'md'} />
    </Button>
  );
}
