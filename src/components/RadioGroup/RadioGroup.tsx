import { createContext, useContext, useId, useState, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldMessage, useFieldIds } from '../Field';
import styles from './RadioGroup.module.css';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

/** Ce que le groupe partage avec chacun de ses boutons radio. */
interface RadioGroupContextValue {
  name: string;
  selected: string | undefined;
  select: (value: string) => void;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /** Question posée par le groupe, rendue dans la `<legend>` : obligatoire. */
  label: ReactNode;
  /** Les choix. Alternative : passer des `<Radio>` en enfants. */
  options?: RadioOption[];
  /** Des `<Radio>` (si `options` n'est pas utilisé). */
  children?: ReactNode;
  /** Valeur sélectionnée (mode contrôlé). */
  value?: string;
  /** Valeur sélectionnée au départ (mode non contrôlé). */
  defaultValue?: string;
  /** Appelé avec la nouvelle valeur à chaque changement de sélection. */
  onChange?: (value: string) => void;
  /** Nom du groupe dans le formulaire (généré si absent). */
  name?: string;
  /** Texte d'aide sous la question. */
  hint?: ReactNode;
  /** Message d'erreur : ajoute `aria-invalid` au groupe et relie le message. */
  error?: string;
  /** `horizontal` uniquement pour 2 ou 3 choix courts. */
  orientation?: RadioGroupOrientation;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * Groupe de boutons radio : un choix UNIQUE parmi quelques options, toutes visibles.
 * Navigation clavier native : Tab entre dans le groupe, les flèches changent la sélection.
 */
export function RadioGroup({
  label,
  options,
  children,
  value,
  defaultValue,
  onChange,
  name,
  hint,
  error,
  orientation = 'vertical',
  disabled = false,
  required = false,
  className,
}: RadioGroupProps) {
  const ids = useFieldIds({ hasHint: Boolean(hint), hasError: Boolean(error) });
  const legendId = `${ids.controlId}-question`;
  const autoName = useId();
  // Mode non contrôlé : on garde la sélection ici ; en mode contrôlé, `value` fait foi
  const [internal, setInternal] = useState(defaultValue);
  const selected = value !== undefined ? value : internal;

  const context: RadioGroupContextValue = {
    name: name ?? autoName,
    selected,
    select: (next) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    disabled,
    required,
    invalid: Boolean(error),
  };

  return (
    <fieldset
      // radiogroup (autorisé sur un fieldset) accepte aria-invalid et aria-required, contrairement à group
      role="radiogroup"
      aria-labelledby={legendId}
      aria-describedby={ids.describedBy}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      disabled={disabled}
      className={cx(styles.group, className)}
    >
      <legend id={legendId} className={styles.legend}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </legend>
      {hint && <FieldMessage id={ids.hintId}>{hint}</FieldMessage>}
      <div className={cx(styles.options, styles[orientation])}>
        <RadioGroupContext value={context}>
          {options?.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              disabled={option.disabled}
            />
          ))}
          {children}
        </RadioGroupContext>
      </div>
      {error && (
        <FieldMessage id={ids.errorId} tone="error">
          {error}
        </FieldMessage>
      )}
    </fieldset>
  );
}

export interface RadioProps extends Omit<
  ComponentProps<'input'>,
  'type' | 'name' | 'checked' | 'defaultChecked' | 'value' | 'size'
> {
  /** Valeur envoyée quand ce choix est sélectionné. */
  value: string;
  /** Libellé cliquable. */
  label: ReactNode;
  /** Précision sous le libellé. */
  description?: ReactNode;
  className?: string;
}

/** Un choix du groupe. S'utilise uniquement à l'intérieur d'un `<RadioGroup>`. */
export function Radio({ value, label, description, disabled, id, className, onChange, ...rest }: RadioProps) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error('<Radio> doit être placé dans un <RadioGroup>.');

  const ids = useFieldIds({ id, hasHint: Boolean(description) });
  const isDisabled = group.disabled || disabled;

  return (
    <div className={cx(styles.radio, isDisabled && styles.disabled, className)}>
      <input
        {...rest}
        id={ids.controlId}
        type="radio"
        name={group.name}
        value={value}
        checked={group.selected === value}
        onChange={(event) => {
          group.select(value);
          onChange?.(event);
        }}
        disabled={isDisabled}
        required={group.required}
        aria-describedby={ids.describedBy}
        className={cx(styles.input, group.invalid && styles.invalid)}
      />
      <span className={styles.text}>
        <label htmlFor={ids.controlId} className={styles.label}>
          {label}
        </label>
        {description && <FieldMessage id={ids.hintId}>{description}</FieldMessage>}
      </span>
    </div>
  );
}
