import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Alert, type AlertVariant } from '../Alert';
import styles from './Toast.module.css';

export type ToastVariant = AlertVariant;

export interface ToastOptions {
  /** Message principal, court : « Rapport envoyé ». */
  title: ReactNode;
  /** Précision facultative sur une ligne. */
  description?: ReactNode;
  /** Nature du message (`info` par défaut). */
  variant?: ToastVariant;
  /** Durée d'affichage en millisecondes (5000 par défaut). `Infinity` = reste affiché jusqu'à fermeture. */
  duration?: number;
}

export interface ToastContextValue {
  /** Affiche un toast et renvoie son identifiant. */
  toast: (options: ToastOptions) => string;
  /** Ferme un toast (avec son animation de sortie). */
  dismiss: (id: string) => void;
}

interface ToastItemData extends Required<Omit<ToastOptions, 'description'>> {
  id: string;
  description?: ReactNode;
  closing: boolean;
}

const DEFAULT_DURATION = 5000;
// Filet de sécurité : si l'événement de fin d'animation ne vient jamais, on retire le toast quand même.
const EXIT_FALLBACK_MS = 1000;

const ToastContext = createContext<ToastContextValue | null>(null);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface ToastProviderProps {
  children: ReactNode;
  /** Nom de la zone de notifications, annoncé par les lecteurs d'écran. */
  label?: string;
}

/**
 * Fournit `useToast()` à toute l'application et affiche la pile de toasts en bas à droite.
 * La zone `aria-live="polite"` existe dès le départ (même vide) : c'est indispensable pour que
 * les lecteurs d'écran annoncent les toasts qui y apparaissent ensuite.
 */
export function ToastProvider({ children, label = 'Notifications' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      // Sans animation, rien n'attendra la fin de l'animation de sortie : on retire tout de suite.
      if (prefersReducedMotion()) {
        remove(id);
        return;
      }
      setToasts((current) => current.map((item) => (item.id === id ? { ...item, closing: true } : item)));
    },
    [remove],
  );

  const toast = useCallback((options: ToastOptions) => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    setToasts((current) => [
      ...current,
      {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? 'info',
        duration: options.duration ?? DEFAULT_DURATION,
        closing: false,
      },
    ]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section className={styles.region} aria-label={label} aria-live="polite">
        <ol className={styles.list}>
          {toasts.map((item) => (
            <ToastItem key={item.id} item={item} onDismiss={dismiss} onRemove={remove} />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  item: ToastItemData;
  onDismiss: (id: string) => void;
  onRemove: (id: string) => void;
}

/** Un toast de la pile : gère son minuteur, mis en pause au survol et au focus. */
function ToastItem({ item, onDismiss, onRemove }: ToastItemProps) {
  const { id, title, description, variant, duration, closing } = item;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const remaining = useRef(duration);

  // Minuteur de fermeture automatique : on décompte seulement le temps où le toast n'est pas en pause.
  useEffect(() => {
    if (closing || paused || !Number.isFinite(duration) || duration <= 0) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [closing, paused, duration, id, onDismiss]);

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => onRemove(id), EXIT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [closing, id, onRemove]);

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    // Le focus passe d'un élément du toast à un autre : on reste en pause
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- le survol met le minuteur en pause ; le focus clavier aussi (onFocus)
    <li
      className={cx(styles.toast, closing && styles.closing)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget) onRemove(id);
      }}
    >
      {/* live={false} : la zone parente est déjà aria-live, on évite une double annonce */}
      <Alert
        variant={variant}
        title={title}
        live={false}
        onDismiss={() => onDismiss(id)}
        dismissLabel="Fermer la notification"
        className={styles.alert}
      >
        {description}
      </Alert>
    </li>
  );
}

/** Donne accès à `toast()` et `dismiss()`. À utiliser sous un `ToastProvider`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast() doit être utilisé à l’intérieur d’un <ToastProvider>.');
  }
  return context;
}
