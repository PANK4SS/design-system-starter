import { useEffect, useRef, type ComponentProps, type ReactNode, type Ref } from 'react';
import { Check, Minus } from 'lucide-react';
import { cx } from '../../utils/cx';
import { FieldMessage, useFieldIds } from '../Field';
import { Icon } from '../Icon';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  /** Libellé cliquable, à droite de la case. */
  label: ReactNode;
  /** Précision affichée sous le libellé, reliée par `aria-describedby`. */
  description?: ReactNode;
  /**
   * État « partiellement coché » (ex. : une case « Tout sélectionner » quand seule une partie l'est).
   * Purement visuel et annoncé par les lecteurs d'écran : le clic repasse la case en coché / décoché.
   */
  indeterminate?: boolean;
  /** Message d'erreur (ex. : conditions à accepter). Ajoute `aria-invalid`. */
  error?: string;
  /** Classe ajoutée sur l'enveloppe. */
  className?: string;
}

/** Fusionne la ref interne (pour `indeterminate`) et celle éventuellement passée par le consommateur. */
function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

/** Case à cocher native, redessinée. Contrôlée (`checked`) ou non (`defaultChecked`). */
export function Checkbox({
  label,
  description,
  indeterminate = false,
  error,
  id,
  disabled,
  className,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: CheckboxProps) {
  const ids = useFieldIds({
    id,
    hasHint: Boolean(description),
    hasError: Boolean(error),
    describedBy: ariaDescribedBy,
  });
  const innerRef = useRef<HTMLInputElement | null>(null);

  // `indeterminate` n'existe pas en attribut HTML : il ne se règle qu'en JavaScript, sur l'élément
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx(styles.checkbox, disabled && styles.disabled, className)}>
      <span className={styles.box}>
        <input
          {...rest}
          ref={(node) => {
            innerRef.current = node;
            assignRef(ref, node);
          }}
          id={ids.controlId}
          type="checkbox"
          className={cx(styles.input, error && styles.invalid)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        />
        <Icon icon={Check} size="sm" stroke="bold" className={styles.check} />
        <Icon icon={Minus} size="sm" stroke="bold" className={styles.dash} />
      </span>
      <span className={styles.text}>
        <label htmlFor={ids.controlId} className={styles.label}>
          {label}
        </label>
        {description && <FieldMessage id={ids.hintId}>{description}</FieldMessage>}
        {error && (
          <FieldMessage id={ids.errorId} tone="error">
            {error}
          </FieldMessage>
        )}
      </span>
    </div>
  );
}
