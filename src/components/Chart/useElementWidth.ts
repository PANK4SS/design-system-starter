import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Mesure la largeur d'un élément et la suit quand elle change (ResizeObserver).
 * Le graphique est redessiné à la bonne largeur : les textes gardent leur taille réelle,
 * contrairement à un SVG simplement étiré par son viewBox.
 */
export function useElementWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setWidth(element.clientWidth || fallback);
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setWidth(next);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [fallback]);

  return [ref, width] as const;
}
