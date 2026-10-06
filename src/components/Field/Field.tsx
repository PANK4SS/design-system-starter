import { useId, type ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Field.module.css';
import a11y from '../../utils/visuallyHidden.module.css';

export interface FieldIdsOptions {
  /** Identifiant imposé par le consommateur (sinon un identifiant unique est généré). */
  id?: string;
  /** Un texte d'aide est-il affiché ? */
  hasHint?: boolean;
  /** Un message d'erreur est-il affiché ? */
  hasError?: boolean;
  /** `aria-describedby` déjà fourni par le consommateur, conservé en plus des nôtres. */
  describedBy?: string;
}

export interface FieldIds {
  /** Identifiant du contrôle (à poser sur l'input et sur le `htmlFor` du label). */
  controlId: string;
  hintId: string;
  errorId: string;
  /** Valeur prête pour `aria-describedby` (ou `undefined` s'il n'y a rien à décrire). */
  describedBy: string | undefined;
}

/**
 * Fabrique les identifiants qui relient un contrôle à son label, son aide et son erreur.
 * L'aide et l'erreur sont lues par le lecteur d'écran APRÈS le label, grâce à `aria-describedby`.
 */
export function useFieldIds({ id, hasHint, hasError, describedBy }: FieldIdsOptions): FieldIds {
  const autoId = useId();
  const controlId = id ?? autoId;
  const hintId = `${controlId}-aide`;
  const errorId = `${controlId}-erreur`;
  const ids = [describedBy, hasHint && hintId, hasError && errorId].filter(Boolean).join(' ');
  return { controlId, hintId, errorId, describedBy: ids || undefined };
}

export interface FieldMessageProps {
  id: string;
  /** `error` : texte rouge précédé d'une icône (la couleur seule ne suffit jamais). */
  tone?: 'hint' | 'error';
  children: ReactNode;
}

/** Texte d'aide ou message d'erreur placé sous un contrôle. */
export function FieldMessage({ id, tone = 'hint', children }: FieldMessageProps) {
  return (
    <p id={id} className={cx(styles.message, styles[tone])}>
      {tone === 'error' && <Icon icon={CircleAlert} size="sm" className={styles.messageIcon} />}
      <span>{children}</span>
    </p>
  );
}

export interface FieldProps {
  /** Libellé visible, relié au contrôle par `htmlFor`. */
  label: ReactNode;
  /** Texte d'aide affiché sous le contrôle. */
  hint?: ReactNode;
  /** Message d'erreur : remplace visuellement l'état normal. */
  error?: string;
  /** Les identifiants produits par `useFieldIds`. */
  ids: FieldIds;
  /** Affiche un astérisque après le libellé (l'attribut `required` du contrôle reste la vraie source). */
  required?: boolean;
  /** Masque visuellement le libellé tout en le gardant pour les lecteurs d'écran. */
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Enveloppe interne commune à Input, Textarea et Select : label au-dessus, contrôle, puis aide et erreur.
 * Le contrôle lui-même (et ses attributs ARIA) reste sous la responsabilité du composant appelant.
 */
export function Field({ label, hint, error, ids, required, hideLabel, className, children }: FieldProps) {
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={ids.controlId} className={cx(styles.label, hideLabel && a11y.visuallyHidden)}>
        {label}
        {/* L'astérisque est décoratif : `required` sur le contrôle annonce déjà « obligatoire » */}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && <FieldMessage id={ids.hintId}>{hint}</FieldMessage>}
      {error && (
        <FieldMessage id={ids.errorId} tone="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}
