import type { ComponentProps, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Field, useFieldIds } from '../Field';
import control from '../Field/control.module.css';
import { Icon } from '../Icon';
import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentProps<'select'>, 'size' | 'children' | 'multiple'> {
  /** Libellé visible, toujours obligatoire. */
  label: ReactNode;
  /** Les choix proposés, dans l'ordre d'affichage. */
  options: SelectOption[];
  /** Première option vide (« Choisir… »), non sélectionnable une fois un choix fait. */
  placeholder?: string;
  /** Texte d'aide sous le champ. */
  hint?: ReactNode;
  /** Message d'erreur. Quand il est présent : bordure rouge, `aria-invalid` et message relié au champ. */
  error?: string;
  /** Densité : `sm` dans un filtre, `md` dans un formulaire, `lg` pour un champ mis en avant. */
  size?: SelectSize;
  /** Classe ajoutée sur l'enveloppe du champ (label compris). */
  className?: string;
}

/**
 * Liste déroulante NATIVE, simplement habillée : on garde gratuitement le clavier,
 * les lecteurs d'écran et le sélecteur adapté au mobile.
 */
export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  size = 'md',
  id,
  value,
  defaultValue,
  disabled,
  required,
  className,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SelectProps) {
  const ids = useFieldIds({ id, hasHint: Boolean(hint), hasError: Boolean(error), describedBy: ariaDescribedBy });
  // Sans valeur fournie, le placeholder doit être l'option affichée au départ
  const initialValue = value === undefined && defaultValue === undefined && placeholder ? '' : defaultValue;

  return (
    <Field label={label} hint={hint} error={error} ids={ids} required={required} className={className}>
      <div className={cx(control.control, control[size], error && control.invalid, disabled && control.disabled)}>
        <select
          {...rest}
          id={ids.controlId}
          value={value}
          defaultValue={initialValue}
          className={cx(control.native, styles.select)}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={cx(control.adornment, styles.chevron)} aria-hidden="true">
          <Icon icon={ChevronDown} size="sm" />
        </span>
      </div>
    </Field>
  );
}
