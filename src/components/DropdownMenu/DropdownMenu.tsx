import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useControllableState } from '../../hooks/useControllableState';
import { Button, type ButtonSize, type ButtonVariant } from '../Button';
import { Icon } from '../Icon';
import styles from './DropdownMenu.module.css';

/** Une action du menu. */
export interface DropdownMenuAction {
  type?: 'item';
  /** Libellé de l'action : un verbe (« Renommer », « Supprimer »). */
  label: string;
  /** Icône décorative affichée avant le libellé. */
  icon?: LucideIcon;
  /** Appelé quand l'action est choisie (clic, Entrée ou Espace). Le menu se ferme ensuite. */
  onSelect?: () => void;
  /** Action destructrice : affichée en rouge. */
  danger?: boolean;
  /** Action indisponible : reste atteignable au clavier (pour être découverte) mais ne fait rien. */
  disabled?: boolean;
}

/** Trait de séparation entre deux groupes d'actions. */
export interface DropdownMenuSeparator {
  type: 'separator';
}

export type DropdownMenuItem = DropdownMenuAction | DropdownMenuSeparator;

export interface DropdownMenuProps {
  /** Texte du bouton déclencheur. */
  label: ReactNode;
  /** Actions et séparateurs, dans l'ordre d'affichage. */
  items: DropdownMenuItem[];
  /**
   * Nom accessible du déclencheur, OBLIGATOIRE si `label` n'est pas un texte lisible
   * (ex. une icône seule « plus d'actions »).
   */
  'aria-label'?: string;
  /** Variante du bouton déclencheur (voir `Button`). */
  triggerVariant?: ButtonVariant;
  /** Taille du bouton déclencheur (voir `Button`). */
  triggerSize?: ButtonSize;
  /** Masque le chevron du déclencheur (utile pour un bouton-icône). */
  hideChevron?: boolean;
  /** Alignement du menu sous le déclencheur : bord gauche (`start`) ou bord droit (`end`). */
  align?: 'start' | 'end';
  /** Ouverture contrôlée. Laisser vide pour que le composant gère seul son état. */
  open?: boolean;
  /** Ouverture initiale en mode non contrôlé. */
  defaultOpen?: boolean;
  /** Appelé à chaque ouverture / fermeture. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const isAction = (item: DropdownMenuItem): item is DropdownMenuAction => item.type !== 'separator';

/**
 * Bouton qui ouvre une liste d'actions (motif « menu button » des WAI-ARIA APG).
 * Flèches haut/bas pour naviguer, Début/Fin pour les extrémités, une lettre pour sauter à une action,
 * Entrée/Espace pour choisir, Échap pour fermer et revenir au bouton.
 */
export function DropdownMenu({
  label,
  items,
  'aria-label': ariaLabel,
  triggerVariant = 'secondary',
  triggerSize = 'md',
  hideChevron = false,
  align = 'start',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  // Index (dans `actions`) de l'élément qui doit recevoir le focus à l'ouverture
  const [focusIndex, setFocusIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const triggerId = useId();
  const menuId = useId();

  const actions = items.filter(isAction);

  // Le Button ne transmet pas de ref : on retrouve le déclencheur par son id
  const focusTrigger = () => document.getElementById(triggerId)?.focus();

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) focusTrigger();
  };

  const openAt = (index: number) => {
    setFocusIndex(index);
    setOpen(true);
  };

  // Un clic en dehors du composant ferme le menu (sans voler le focus à ce qui a été cliqué)
  useClickOutside([rootRef], () => close(false), open);

  // Focus « itinérant » : à chaque ouverture ou déplacement, le focus va sur l'action courante
  useEffect(() => {
    if (open) itemRefs.current[focusIndex]?.focus();
  }, [open, focusIndex]);

  const moveFocus = (index: number) => {
    const count = actions.length;
    setFocusIndex((index + count) % count);
  };

  const select = (action: DropdownMenuAction) => {
    if (action.disabled) return;
    close(true);
    action.onSelect?.();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Entrée et Espace déclenchent le clic natif du bouton (qui ouvre sur la première action)
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAt(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAt(actions.length - 1);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        moveFocus(focusIndex + 1);
        break;
      case 'ArrowUp':
        moveFocus(focusIndex - 1);
        break;
      case 'Home':
        setFocusIndex(0);
        break;
      case 'End':
        setFocusIndex(actions.length - 1);
        break;
      case 'Enter':
      case ' ':
        select(actions[focusIndex]);
        break;
      case 'Escape':
        close(true);
        break;
      case 'Tab':
        // Tab quitte le menu : on le ferme et on laisse le focus avancer naturellement
        close(false);
        return;
      default: {
        // Saisie d'une lettre : saute à la prochaine action qui commence par cette lettre
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
        const char = event.key.toLocaleLowerCase('fr');
        for (let step = 1; step <= actions.length; step++) {
          const index = (focusIndex + step) % actions.length;
          if (actions[index].label.toLocaleLowerCase('fr').startsWith(char)) {
            setFocusIndex(index);
            break;
          }
        }
      }
    }
    event.preventDefault();
  };

  // Position de chaque action parmi les actions (les séparateurs ne comptent pas), pour la navigation au clavier

  const actionPositions = items.map((_, i) => items.slice(0, i + 1).filter(isAction).length - 1);

  return (
    <div ref={rootRef} className={cx(styles.root, className)}>
      <Button
        id={triggerId}
        variant={triggerVariant}
        size={triggerSize}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close(false) : openAt(0))}
        onKeyDown={onTriggerKeyDown}
        iconEnd={
          hideChevron ? undefined : (
            <Icon icon={ChevronDown} size="sm" className={cx(styles.chevron, open && styles.chevronOpen)} />
          )
        }
      >
        {label}
      </Button>

      {open && (
        // oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- APG : le focus va sur les éléments du menu, pas sur le menu
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          aria-orientation="vertical"
          className={cx(styles.menu, styles[align])}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item, i) => {
            if (!isAction(item)) {
              // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- séparateur décoratif non focalisable, pas un contrôle
              return <div key={`separator-${i}`} role="separator" className={styles.separator} />;
            }
            const index = actionPositions[i];
            return (
              <button
                key={`${item.label}-${i}`}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitem"
                // Aucun élément du menu n'est dans l'ordre de tabulation : le focus est déplacé par les flèches
                tabIndex={-1}
                aria-disabled={item.disabled || undefined}
                className={cx(styles.item, item.danger && styles.danger)}
                onClick={() => select(item)}
                // Le survol déplace aussi le focus, comme dans un menu natif
                onPointerMove={() => index !== focusIndex && setFocusIndex(index)}
              >
                {item.icon && <Icon icon={item.icon} size="sm" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
