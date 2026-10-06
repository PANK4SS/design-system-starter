import { useRef, useState, type ComponentProps, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useFieldIds } from '../Field';
import control from '../Field/control.module.css';
import fieldStyles from '../Field/Field.module.css';
import { Icon } from '../Icon';
import styles from './SearchBar.module.css';

export type SearchBarSize = 'sm' | 'md' | 'lg';

export interface SearchBarProps
  extends Omit<ComponentProps<'input'>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** Libellé du champ (et nom du repère « recherche »). Masqué visuellement par défaut, mais toujours lu. */
  label?: string;
  /** Affiche le libellé au-dessus du champ au lieu de le masquer. */
  showLabel?: boolean;
  /** Texte recherché (mode contrôlé). */
  value?: string;
  /** Texte de départ (mode non contrôlé). */
  defaultValue?: string;
  /** Appelé à chaque frappe, avec le texte saisi. */
  onValueChange?: (value: string) => void;
  /** Appelé à la validation (touche Entrée), avec le texte saisi. */
  onSearch?: (value: string) => void;
  /** Appelé quand l'utilisateur vide le champ avec le bouton d'effacement. */
  onClear?: () => void;
  /** Densité : `sm` dans une barre d'outils, `md` par défaut, `lg` pour une recherche mise en avant. */
  size?: SearchBarSize;
  /** Classe ajoutée sur le `<form>`. */
  className?: string;
}

/**
 * Barre de recherche : un repère `role="search"` contenant un champ `type="search"`.
 * Entrée lance `onSearch` ; un bouton permet d'effacer le texte et rend le focus au champ.
 */
export function SearchBar({
  label = 'Rechercher',
  showLabel = false,
  value,
  defaultValue = '',
  onValueChange,
  onSearch,
  onClear,
  size = 'md',
  id,
  disabled,
  placeholder = 'Rechercher…',
  className,
  ...rest
}: SearchBarProps) {
  const { controlId } = useFieldIds({ id });
  const inputRef = useRef<HTMLInputElement>(null);
  // Mode non contrôlé : on garde le texte ici pour savoir s'il faut afficher le bouton d'effacement
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;

  const update = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Composant « bête » : pas de rechargement de page, on transmet simplement le texte
    event.preventDefault();
    onSearch?.(current);
  };

  const handleClear = () => {
    update('');
    onClear?.();
    // Le bouton disparaît : on rend le focus au champ pour ne pas perdre l'utilisateur clavier
    inputRef.current?.focus();
  };

  return (
    <form role="search" aria-label={label} onSubmit={handleSubmit} className={cx(styles.searchBar, className)}>
      <label htmlFor={controlId} className={cx(fieldStyles.label, !showLabel && fieldStyles.visuallyHidden)}>
        {label}
      </label>
      <div className={cx(control.control, control[size], disabled && control.disabled)}>
        <span className={control.adornment} aria-hidden="true">
          <Icon icon={Search} size="sm" />
        </span>
        <input
          {...rest}
          ref={inputRef}
          id={controlId}
          type="search"
          value={current}
          onChange={(event) => update(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cx(control.native, styles.input)}
        />
        {current && !disabled && (
          <button type="button" className={styles.clear} onClick={handleClear} aria-label="Effacer la recherche">
            <Icon icon={X} size="sm" />
          </button>
        )}
      </div>
    </form>
  );
}
