import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks/useControllableState';
import { Icon } from '../Icon';
import styles from './Tabs.module.css';

/** Un onglet et le contenu de son panneau. */
export interface TabItem {
  /** Identifiant unique de l'onglet (valeur renvoyée par `onChange`). */
  value: string;
  /** Libellé visible de l'onglet : un ou deux mots. */
  label: string;
  /** Icône décorative affichée avant le libellé. */
  icon?: LucideIcon;
  /** Onglet indisponible : ignoré par la navigation au clavier. */
  disabled?: boolean;
  /** Contenu du panneau affiché quand l'onglet est actif. */
  content: ReactNode;
}

export interface TabsProps {
  /** Onglets, dans l'ordre d'affichage. */
  items: TabItem[];
  /** Nom accessible de la liste d'onglets (ex. « Paramètres du compte »). */
  label: string;
  /** Onglet actif en mode contrôlé (avec `onChange`). */
  value?: string;
  /** Onglet actif au départ en mode non contrôlé. Par défaut : le premier onglet disponible. */
  defaultValue?: string;
  /** Appelé avec la `value` du nouvel onglet actif. */
  onChange?: (value: string) => void;
  /** Étire les onglets pour occuper toute la largeur. */
  fullWidth?: boolean;
  className?: string;
}

/**
 * Onglets (motif « tabs » des WAI-ARIA APG, activation automatique) :
 * Flèches gauche/droite pour passer d'un onglet à l'autre (le panneau suit immédiatement),
 * Début/Fin pour le premier/dernier, Tab pour entrer dans le panneau.
 */
export function Tabs({ items, label, value, defaultValue, onChange, fullWidth = false, className }: TabsProps) {
  const enabled = items.filter((item) => !item.disabled);
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue: defaultValue ?? enabled[0]?.value ?? '',
    onChange,
  });

  const baseId = useId();
  const tabRefs = useRef(new Map<string, HTMLButtonElement | null>());
  // Ids construits sur la position (une `value` peut contenir des espaces, interdits dans un id)
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  const activate = (item: TabItem) => {
    if (item.value !== selected) setSelected(item.value);
    tabRefs.current.get(item.value)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = enabled.findIndex((item) => item.value === selected);
    const last = enabled.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = current >= last ? 0 : current + 1;
        break;
      case 'ArrowLeft':
        next = current <= 0 ? last : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    activate(enabled[next]);
  };

  return (
    <div className={cx(styles.tabs, className)}>
      {/* oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- APG : le focus va sur l'onglet actif (tabindex mobile), pas sur la liste */}
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className={cx(styles.list, fullWidth && styles.fullWidth)}
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current.set(item.value, node);
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={isSelected}
              aria-controls={panelId(index)}
              // Tabindex « itinérant » : seul l'onglet actif est dans l'ordre de tabulation
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              className={styles.tab}
              onClick={() => activate(item)}
            >
              {item.icon && <Icon icon={item.icon} size="sm" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.value}
          role="tabpanel"
          id={panelId(index)}
          aria-labelledby={tabId(index)}
          // Le panneau est focalisable pour qu'on puisse y arriver au clavier même sans élément interactif
          tabIndex={0}
          hidden={item.value !== selected}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
