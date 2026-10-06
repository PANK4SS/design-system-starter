import type { LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import styles from './Icon.module.css';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /** Le dessin, importé depuis `lucide-react` : `import { Search } from 'lucide-react'`. */
  icon: LucideIcon;
  /** Taille, issue des tokens `icon.size.*` (16, 20, 24, 32px). */
  size?: IconSize;
  /** Trait plus épais pour les petites tailles ou l'emphase. */
  stroke?: 'regular' | 'bold';
  /**
   * Texte lu par les lecteurs d'écran. À fournir UNIQUEMENT si l'icône porte un sens seule
   * (ex. une icône sans texte à côté). Sinon l'icône est décorative et ignorée.
   */
  label?: string;
  className?: string;
}

export function Icon({ icon: Glyph, size = 'md', stroke = 'regular', label, className }: IconProps) {
  return (
    <Glyph
      className={cx(styles.icon, styles[size], styles[stroke], className)}
      // Une icône décorative est masquée ; une icône porteuse de sens est annoncée comme une image.
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      focusable="false"
    />
  );
}
