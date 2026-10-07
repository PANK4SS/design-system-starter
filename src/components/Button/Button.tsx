import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'rounded' | 'pill';

// ComponentProps<'button'> inclut tous les attributs d'un <button>, et la `ref` (React 19).
export interface ButtonProps extends ComponentProps<'button'> {
  /** Rôle visuel. Un seul `primary` par écran ; `danger` uniquement pour une action destructrice. */
  variant?: ButtonVariant;
  /** Densité : `sm` dans un tableau, `md` dans un formulaire, `lg` pour une action mise en avant. */
  size?: ButtonSize;
  /** Affiche un indicateur de chargement et bloque les clics pendant une action en cours. */
  loading?: boolean;
  /** Prend toute la largeur disponible (utile sur mobile). */
  fullWidth?: boolean;
  /**
   * Forme : `rounded` (coins légèrement arrondis, par défaut) ou `pill` (bords entièrement ronds :
   * filtres, actions flottantes). Avec IconButton, `pill` donne un bouton rond.
   */
  shape?: ButtonShape;
  /** Icône affichée avant le texte. */
  iconStart?: ReactNode;
  /** Icône affichée après le texte. */
  iconEnd?: ReactNode;
}

/** Déclenche une action : enregistrer, envoyer, supprimer… Pour naviguer vers une page, utiliser Link. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  shape = 'rounded',
  iconStart,
  iconEnd,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    shape === 'pill' && styles.pill,
    loading && styles.loading,
    className,
  );

  return (
    <button
      {...rest}
      // Par défaut, un <button> dans un <form> SOUMET le formulaire. On choisit "button" pour éviter les surprises.
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && iconStart && (
        <span className={styles.icon} aria-hidden="true">
          {iconStart}
        </span>
      )}
      <span>{children}</span>
      {iconEnd && (
        <span className={styles.icon} aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </button>
  );
}
