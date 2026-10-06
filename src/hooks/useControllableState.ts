import { useCallback, useState } from 'react';

/**
 * Gère une valeur qui peut être **contrôlée** (le parent fournit `value` + `onChange`)
 * ou **non contrôlée** (le composant garde son propre état, initialisé par `defaultValue`).
 *
 * ```tsx
 * const [valeur, setValeur] = useControllableState({ value, defaultValue, onChange });
 * ```
 *
 * - Si `value` est défini, il fait foi : `setValeur` se contente d'appeler `onChange`.
 * - Sinon, l'état interne est mis à jour PUIS `onChange` est appelé.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  /** Valeur contrôlée par le parent. `undefined` = mode non contrôlé. */
  value?: T;
  /** Valeur initiale en mode non contrôlé. */
  defaultValue: T;
  /** Appelé à chaque changement demandé, dans les deux modes. */
  onChange?: (next: T) => void;
}): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setValue];
}
