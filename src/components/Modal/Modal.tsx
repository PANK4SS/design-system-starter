import { useEffect, useId, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onClose'> {
  /** Ouvre ou ferme la fenêtre. Le composant est toujours **contrôlé** par le parent. */
  open: boolean;
  /** Appelé quand l'utilisateur demande la fermeture (bouton X, touche Échap, clic sur le fond). */
  onClose: () => void;
  /** Titre obligatoire : il nomme la fenêtre pour les lecteurs d'écran (`aria-labelledby`). */
  title: ReactNode;
  /** Phrase d'introduction facultative, reliée par `aria-describedby`. */
  description?: ReactNode;
  /** Zone d'actions en bas de la fenêtre (en général des `Button`). */
  footer?: ReactNode;
  /** Largeur maximale : `sm` pour une confirmation, `md` pour un formulaire court, `lg` pour un contenu riche. */
  size?: ModalSize;
  /** Ferme la fenêtre au clic sur le fond assombri. À désactiver si une saisie risque d'être perdue. */
  closeOnBackdropClick?: boolean;
  /** Nom accessible du bouton de fermeture (icône seule). */
  closeLabel?: string;
  /** Contenu de la fenêtre. */
  children?: ReactNode;
}

/**
 * Fenêtre modale construite sur l'élément natif `<dialog>` ouvert avec `showModal()`.
 * Le navigateur fournit gratuitement : piège du focus, touche Échap, « top layer » (au-dessus de tout)
 * et contenu de la page rendu inerte.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeLabel = 'Fermer',
  className,
  children,
  ...rest
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Élément qui avait le focus avant l'ouverture : on lui rend le focus à la fermeture
  const triggerRef = useRef<HTMLElement | null>(null);
  // Vrai si le clic a COMMENCÉ sur le fond (évite de fermer quand on sélectionne du texte et relâche dehors)
  const pressStartedOnBackdrop = useRef(false);
  // Vrai quand c'est NOUS qui fermons le <dialog> (prop `open` repassée à false) : pas besoin de prévenir le parent
  const closingFromProp = useRef(false);
  // Dernière version de onClose, lue par les écouteurs natifs sans relancer les effets
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Corps qui déborde : il devient focalisable pour pouvoir le faire défiler au clavier
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyScrollable, setBodyScrollable] = useState(false);

  const titleId = useId();
  const descriptionId = useId();

  // Synchronise la prop `open` avec l'état natif du <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();

      // Verrouille le défilement de la page tant que la fenêtre est ouverte
      const root = document.documentElement;
      const previousOverflow = root.style.overflow;
      root.style.overflow = 'hidden';

      return () => {
        root.style.overflow = previousOverflow;
        if (dialog.open) {
          closingFromProp.current = true;
          dialog.close();
        }
        // Rend le focus au déclencheur (s'il existe encore dans la page)
        const trigger = triggerRef.current;
        if (trigger && trigger.isConnected) trigger.focus();
      };
    }
  }, [open]);

  // Surveille la taille du corps pour savoir s'il défile
  useEffect(() => {
    const body = bodyRef.current;
    if (!open || !body) return;
    const measure = () => setBodyScrollable(body.scrollHeight > body.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [open]);

  // Échap déclenche l'événement natif « cancel » : on l'annule pour laisser le parent décider
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    // Filet de sécurité : si le navigateur ferme quand même la fenêtre, on prévient le parent
    const onNativeClose = () => {
      if (closingFromProp.current) closingFromProp.current = false;
      else onCloseRef.current();
    };
    dialog.addEventListener('cancel', onCancel);
    dialog.addEventListener('close', onNativeClose);
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      dialog.removeEventListener('close', onNativeClose);
    };
  }, []);

  // Le <dialog> occupe exactement la boîte visible : un clic dont la cible est le <dialog> lui-même
  // tombe donc sur le fond (::backdrop), jamais sur le contenu.
  const handlePointerDown = (event: MouseEvent<HTMLDialogElement>) => {
    pressStartedOnBackdrop.current = event.target === event.currentTarget;
  };
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdropClick && pressStartedOnBackdrop.current && event.target === event.currentTarget) {
      onClose();
    }
    pressStartedOnBackdrop.current = false;
  };

  return (
    <dialog
      {...rest}
      ref={dialogRef}
      className={cx(styles.dialog, styles[size], className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* Le contenu n'est monté que lorsque la fenêtre est ouverte */}
      {open && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div className={styles.heading}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
              <Icon icon={X} size="md" />
            </button>
          </header>

          <div ref={bodyRef} className={styles.body} tabIndex={bodyScrollable ? 0 : undefined}>
            {children}
          </div>

          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
