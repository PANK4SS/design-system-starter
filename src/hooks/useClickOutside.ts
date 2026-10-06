import { useEffect, useRef, type RefObject } from 'react';

/**
 * Appelle `handler` quand l'utilisateur clique (ou touche l'écran) EN DEHORS de tous les
 * éléments référencés. Typiquement : fermer un menu déroulant quand on clique ailleurs.
 *
 * ```tsx
 * useClickOutside([triggerRef, menuRef], () => setOpen(false), open);
 * ```
 *
 * @param refs    Éléments considérés comme « dedans » (le déclencheur ET le panneau, en général).
 * @param handler Action à exécuter lors d'un clic extérieur.
 * @param enabled N'écoute les clics que si `true` (ex. seulement quand le menu est ouvert).
 */
export function useClickOutside(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  handler: (event: PointerEvent) => void,
  enabled = true,
): void {
  // On garde toujours la dernière version du handler sans relancer l'effet à chaque rendu
  const handlerRef = useRef(handler);
  const refsRef = useRef(refs);
  useEffect(() => {
    handlerRef.current = handler;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const inside = refsRef.current.some((ref) => ref.current && target && ref.current.contains(target));
      if (!inside) handlerRef.current(event);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [enabled]);
}
