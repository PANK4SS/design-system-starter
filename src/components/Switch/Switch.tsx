import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldMessage, useFieldIds } from '../Field';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<ComponentProps<'input'>, 'type' | 'size' | 'role'> {
  /** Ce que l'interrupteur active : « Authentification à deux facteurs ». */
  label: ReactNode;
  /** Précision sous le libellé, reliée par `aria-describedby`. */
  description?: ReactNode;
  /** Classe ajoutée sur l'enveloppe. */
  className?: string;
}

/**
 * Interrupteur marche / arrêt pour un réglage appliqué IMMÉDIATEMENT.
 * Case à cocher native avec `role="switch"` : annoncée « activé / désactivé », basculée avec Espace.
 * Contrôlé (`checked` + `onChange`) ou non (`defaultChecked`).
 */
export function Switch({
  label,
  description,
  id,
  disabled,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SwitchProps) {
  const ids = useFieldIds({ id, hasHint: Boolean(description), describedBy: ariaDescribedBy });

  return (
    <div className={cx(styles.switch, disabled && styles.disabled, className)}>
      <span className={styles.track}>
        <input
          {...rest}
          id={ids.controlId}
          type="checkbox"
          // oxlint-disable-next-line jsx-a11y/role-has-required-aria-props -- un <input type="checkbox"> fournit nativement l'état coché (pas besoin d'aria-checked)
          role="switch"
          className={styles.input}
          disabled={disabled}
          aria-describedby={ids.describedBy}
        />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      <span className={styles.text}>
        <label htmlFor={ids.controlId} className={styles.label}>
          {label}
        </label>
        {description && <FieldMessage id={ids.hintId}>{description}</FieldMessage>}
      </span>
    </div>
  );
}
