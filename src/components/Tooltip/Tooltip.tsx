import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * Texte de l'infobulle. Texte simple UNIQUEMENT : une infobulle ne doit jamais contenir
   * de lien, de bouton ni aucun élément interactif (on ne peut pas l'atteindre au clavier).
   */
  content: ReactNode;
  /** L'élément déclencheur, qui doit pouvoir recevoir le focus (bouton, lien…). Un seul enfant. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Côté où s'affiche l'infobulle par rapport au déclencheur. */
  placement?: TooltipPlacement;
  /** Délai (ms) avant l'affichage au survol de la souris, pour éviter les apparitions intempestives. */
  delay?: number;
  className?: string;
}

/**
 * Infobulle : courte description d'un élément, affichée au survol ET au focus clavier.
 * Elle est reliée au déclencheur par `aria-describedby` : le lecteur d'écran la lit après le nom de l'élément.
 */
export function Tooltip({ content, children, placement = 'top', delay = 300, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  const clearTimer = () => window.clearTimeout(timer.current);
  const show = (withDelay: boolean) => {
    clearTimer();
    if (withDelay) timer.current = window.setTimeout(() => setVisible(true), delay);
    else setVisible(true);
  };
  const hide = () => {
    clearTimer();
    setVisible(false);
  };

  // Échap masque l'infobulle sans déplacer le focus (WCAG 1.4.13 : contenu « masquable »)
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  // Nettoyage du minuteur si le composant disparaît pendant le délai
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // On ajoute notre id à un éventuel aria-describedby déjà présent sur le déclencheur
  const trigger = isValidElement(children)
    ? cloneElement(children, {
        'aria-describedby': cx(children.props['aria-describedby'], tooltipId),
      })
    : children;

  return (
    <span
      className={cx(styles.wrapper, className)}
      onPointerEnter={(event) => event.pointerType === 'mouse' && show(true)}
      onPointerLeave={hide}
      onFocus={() => show(false)}
      onBlur={hide}
    >
      {trigger}
      {/* Toujours présent dans le DOM (masqué) : la description reste disponible pour les lecteurs d'écran */}
      <span id={tooltipId} role="tooltip" className={cx(styles.tooltip, styles[placement])} hidden={!visible}>
        {content}
      </span>
    </span>
  );
}
