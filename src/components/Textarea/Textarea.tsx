import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Field, useFieldIds } from '../Field';
import control from '../Field/control.module.css';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** Libellé visible, toujours obligatoire. */
  label: ReactNode;
  /** Texte d'aide sous le champ (longueur attendue, contenu conseillé…). */
  hint?: ReactNode;
  /** Message d'erreur. Quand il est présent : bordure rouge, `aria-invalid` et message relié au champ. */
  error?: string;
  /** Autorise l'utilisateur à agrandir le champ verticalement. */
  resizable?: boolean;
  /** Classe ajoutée sur l'enveloppe du champ (label compris). */
  className?: string;
}

/** Champ de saisie sur plusieurs lignes (message, commentaire, description). */
export function Textarea({
  label,
  hint,
  error,
  resizable = true,
  rows = 4,
  id,
  disabled,
  readOnly,
  required,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: TextareaProps) {
  const ids = useFieldIds({ id, hasHint: Boolean(hint), hasError: Boolean(error), describedBy: ariaDescribedBy });

  return (
    <Field label={label} hint={hint} error={error} ids={ids} required={required} className={className}>
      <div
        className={cx(
          control.control,
          control.md,
          styles.box,
          error && control.invalid,
          readOnly && control.readOnly,
          disabled && control.disabled,
        )}
      >
        <textarea
          {...rest}
          id={ids.controlId}
          rows={rows}
          className={cx(control.native, styles.textarea, !resizable && styles.fixed)}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        />
      </div>
    </Field>
  );
}
