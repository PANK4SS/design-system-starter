import { useState, type KeyboardEvent } from 'react';

/**
 * Navigation commune aux graphiques : une seule tabulation entre dans le graphique, puis les
 * flèches gauche/droite (et Début/Fin) passent d'une catégorie à l'autre (« roving tabindex »).
 * Le survol à la souris et le focus clavier montrent la même infobulle.
 */
export function useCategoryNavigation(count: number) {
  // Catégorie survolée ou focalisée (null = aucune infobulle)
  const [active, setActive] = useState<number | null>(null);
  // Catégorie qui reçoit la tabulation (on y revient en rentrant dans le graphique)
  const [focusable, setFocusable] = useState(0);

  const onKeyDown = (event: KeyboardEvent<SVGElement>) => {
    const current = active ?? focusable;
    const moves: Record<string, number> = {
      ArrowRight: Math.min(count - 1, current + 1),
      ArrowLeft: Math.max(0, current - 1),
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in moves)) {
      if (event.key === 'Escape') setActive(null);
      return;
    }
    event.preventDefault();
    const next = moves[event.key];
    const target = event.currentTarget.ownerSVGElement?.querySelector<SVGElement>(`[data-index="${next}"]`);
    setFocusable(next);
    target?.focus();
  };

  /** Props à poser sur la zone cible (transparente) de chaque catégorie. */
  const targetProps = (index: number) => ({
    'data-index': index,
    tabIndex: index === focusable ? 0 : -1,
    onPointerEnter: () => setActive(index),
    onPointerLeave: () => setActive((value) => (value === index ? null : value)),
    onFocus: () => {
      setFocusable(index);
      setActive(index);
    },
    onBlur: () => setActive((value) => (value === index ? null : value)),
    onKeyDown,
  });

  return { active: active !== null && active < count ? active : null, targetProps };
}
