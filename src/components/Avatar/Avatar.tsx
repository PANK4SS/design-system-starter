import { useState, type HTMLAttributes } from 'react';
import { User } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Adresse de la photo. Si elle est absente ou ne se charge pas, on affiche les initiales. */
  src?: string;
  /** Nom complet de la personne : sert aux initiales et, par défaut, au texte alternatif. */
  name?: string;
  /**
   * Texte alternatif. Par défaut : `name`. Passer `""` si le nom est déjà écrit juste à côté
   * (l'avatar devient décoratif et n'est pas lu deux fois).
   */
  alt?: string;
  /** `sm` dans une liste dense, `md` par défaut, `lg`/`xl` pour une page de profil. */
  size?: AvatarSize;
  /** Pastille de disponibilité, annoncée avec le nom (« Léa Morel, en ligne »). */
  status?: AvatarStatus;
}

const statusLabels: Record<AvatarStatus, string> = {
  online: 'en ligne',
  away: 'absent',
  busy: 'occupé',
  offline: 'hors ligne',
};

/** « Jeanne Martin-Durand » -> « JM » : première lettre du premier et du dernier mot. */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Représente une personne : photo, sinon initiales, sinon une icône générique. */
export function Avatar({ src, name, alt, size = 'md', status, className, ...rest }: AvatarProps) {
  // On mémorise l'adresse qui a échoué : si `src` change, la nouvelle image est retentée.
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = Boolean(src) && failedSrc !== src;
  const initials = name ? getInitials(name) : '';

  const baseLabel = alt ?? name ?? 'Utilisateur';
  const decorative = alt === '';
  const label = status ? `${baseLabel}, ${statusLabels[status]}` : baseLabel;

  return (
    <span
      {...rest}
      className={cx(styles.avatar, styles[size], className)}
      // L'ensemble (photo ou initiales + pastille) forme UNE image avec UN nom accessible
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label })}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : initials ? (
        <span className={styles.initials}>{initials}</span>
      ) : (
        <Icon icon={User} className={styles.fallbackIcon} />
      )}
      {status && <span className={cx(styles.status, styles[status])} />}
    </span>
  );
}
