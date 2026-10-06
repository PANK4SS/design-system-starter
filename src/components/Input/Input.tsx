import { useState, type ComponentProps, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Field, useFieldIds } from '../Field';
import control from '../Field/control.module.css';
import { Icon } from '../Icon';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  /** Libellé visible, toujours obligatoire : un placeholder ne remplace JAMAIS un label. */
  label: ReactNode;
  /** Texte d'aide sous le champ (format attendu, exemple…). */
  hint?: ReactNode;
  /** Message d'erreur. Quand il est présent : bordure rouge, `aria-invalid` et message relié au champ. */
  error?: string;
  /** Densité : `sm` dans un tableau ou un filtre, `md` dans un formulaire, `lg` pour un champ mis en avant. */
  size?: InputSize;
  /** Icône décorative affichée au début du champ (passer un `<Icon />`). */
  iconStart?: ReactNode;
  /** Classe ajoutée sur l'enveloppe du champ (label compris). */
  className?: string;
}

/**
 * Champ de saisie d'une ligne. Avec `type="password"`, un bouton permet d'afficher ou de masquer le mot de passe.
 */
export function Input({
  label,
  hint,
  error,
  size = 'md',
  iconStart,
  type = 'text',
  id,
  disabled,
  readOnly,
  required,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: InputProps) {
  const ids = useFieldIds({ id, hasHint: Boolean(hint), hasError: Boolean(error), describedBy: ariaDescribedBy });
  // État interne de l'œil du mot de passe : purement visuel, pas besoin de le contrôler de l'extérieur
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <Field label={label} hint={hint} error={error} ids={ids} required={required} className={className}>
      <div
        className={cx(
          control.control,
          control[size],
          error && control.invalid,
          readOnly && control.readOnly,
          disabled && control.disabled,
        )}
      >
        {iconStart && (
          <span className={control.adornment} aria-hidden="true">
            {iconStart}
          </span>
        )}
        <input
          {...rest}
          id={ids.controlId}
          type={isPassword && passwordVisible ? 'text' : type}
          className={control.native}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setPasswordVisible((visible) => !visible)}
            disabled={disabled}
            aria-controls={ids.controlId}
            // Le libellé décrit l'action à venir : il change à chaque clic
            aria-label={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <Icon icon={passwordVisible ? EyeOff : Eye} size="sm" />
          </button>
        )}
      </div>
    </Field>
  );
}
