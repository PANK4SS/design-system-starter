import type { HTMLAttributes, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Nature du message. Chaque variante a sa couleur ET son icône (la couleur seule ne suffit pas). */
  variant?: AlertVariant;
  /** Titre court, en gras : « Caméra hors ligne ». */
  title?: ReactNode;
  /** Zone d'actions sous le message (un ou deux boutons). */
  actions?: ReactNode;
  /** Si fourni, affiche un bouton de fermeture (croix) qui appelle cette fonction. */
  onDismiss?: () => void;
  /** Nom accessible du bouton de fermeture. */
  dismissLabel?: string;
  /**
   * Annonce le message aux lecteurs d'écran quand il apparaît (`true` par défaut) :
   * - `danger` -> `role="alert"` : annonce IMMÉDIATE, qui interrompt l'utilisateur. Réservé à l'urgent ;
   * - autres -> `role="status"` : annonce POLIE, à la fin de la phrase en cours.
   * Passer `false` quand le message est déjà dans une zone `aria-live` (ex. un Toast), pour éviter une double annonce.
   */
  live?: boolean;
}

const variantIcons: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

/** Message en ligne, dans le flux de la page, qui informe d'un état ou du résultat d'une action. */
export function Alert({
  variant = 'info',
  title,
  actions,
  onDismiss,
  dismissLabel = 'Fermer le message',
  live = true,
  className,
  children,
  ...rest
}: AlertProps) {
  const role = live ? (variant === 'danger' ? 'alert' : 'status') : undefined;

  return (
    <div role={role} {...rest} className={cx(styles.alert, styles[variant], className)}>
      <Icon icon={variantIcons[variant]} size="md" className={styles.icon} />
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.description}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className={styles.close} onClick={onDismiss} aria-label={dismissLabel}>
          <Icon icon={X} size="sm" />
        </button>
      )}
    </div>
  );
}
