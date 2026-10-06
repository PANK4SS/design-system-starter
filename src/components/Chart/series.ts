/*
 * Attribution des couleurs de séries. Règle de la skill dataviz : les 5 couleurs catégorielles
 * sont attribuées dans un ordre FIXE, jamais recyclées. Au-delà de 5 séries, la queue est
 * regroupée dans une série « Autre » grise.
 */

export type ChartColorSlot = 1 | 2 | 3 | 4 | 5;

export interface ChartSeries {
  /** Nom de la série, affiché dans la légende, l'infobulle et le tableau. */
  name: string;
  /** Une valeur par catégorie, dans le même ordre que `categories`. Valeurs positives ou nulles. */
  values: number[];
  /**
   * Fige la couleur (1 à 5) de la série. Utile pour qu'une entité garde sa couleur quand un
   * filtre retire d'autres séries. Par défaut : la position de la série dans la liste.
   */
  colorSlot?: ChartColorSlot;
}

export interface ResolvedSeries {
  name: string;
  values: number[];
  /** Classe CSS (dans Chart.module.css) qui remplit la variable --_series. */
  slot: `slot-${ChartColorSlot}` | 'slot-other';
}

export const MAX_SERIES = 5;

/** Applique l'ordre fixe des couleurs et regroupe les séries en trop dans « Autre ». */
export function resolveSeries(series: ChartSeries[], categoryCount: number): ResolvedSeries[] {
  const fit = (values: number[]) => Array.from({ length: categoryCount }, (_, i) => values[i] ?? 0);

  if (series.length <= MAX_SERIES) {
    return series.map((s, index) => ({
      name: s.name,
      values: fit(s.values),
      slot: `slot-${s.colorSlot ?? ((index + 1) as ChartColorSlot)}`,
    }));
  }

  // Plus de 5 séries : on garde les 4 premières et on additionne le reste. On ne génère JAMAIS une 6e teinte.
  const kept = series.slice(0, MAX_SERIES - 1);
  const rest = series.slice(MAX_SERIES - 1);
  const other = fit([]).map((_, i) => rest.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  return [
    ...kept.map((s, index) => ({
      name: s.name,
      values: fit(s.values),
      slot: `slot-${s.colorSlot ?? ((index + 1) as ChartColorSlot)}` as const,
    })),
    { name: `Autre (${rest.length} séries)`, values: other, slot: 'slot-other' as const },
  ];
}
