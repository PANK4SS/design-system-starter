import { useId } from 'react';
import { cx } from '../../utils/cx';
import {
  ChartFrame,
  ChartTooltip,
  XLabels,
  YGrid,
  formatNumberFr,
  linearScale,
  niceTicks,
  resolveSeries,
  useCategoryNavigation,
  yAxisWidth,
  type ChartBaseProps,
  type ChartMargins,
  type ChartSeries,
} from '../Chart';
import chartStyles from '../Chart/Chart.module.css';
import styles from './BarChart.module.css';

export interface BarChartProps extends ChartBaseProps {
  /**
   * Les séries à comparer (5 au maximum : au-delà, les suivantes sont regroupées dans « Autre »).
   * Valeurs positives ou nulles.
   */
  series: ChartSeries[];
  /** Empile les séries (part du total) au lieu de les placer côte à côte. */
  stacked?: boolean;
}

/** Épaisseur maximale d'une barre : on ne remplit jamais toute la place, l'air fait partie du dessin. */
const MAX_BAR = 24;
/** Espace (couleur du fond) entre deux barres ou deux segments qui se touchent. */
const GAP = 2;
/** Rayon de l'extrémité arrondie, côté donnée uniquement. */
const RADIUS = 4;

/** Rectangle avec les deux coins du HAUT arrondis (extrémité de la donnée), bas carré sur la ligne de base. */
function topRoundedBar(x: number, y: number, width: number, height: number, rounded: boolean) {
  const r = rounded ? Math.min(RADIUS, width / 2, height) : 0;
  return [
    `M${x},${y + height}`,
    `V${y + r}`,
    `A${r},${r} 0 0 1 ${x + r},${y}`,
    `H${x + width - r}`,
    `A${r},${r} 0 0 1 ${x + width},${y + r}`,
    `V${y + height}`,
    'Z',
  ].join(' ');
}

/**
 * Histogramme (barres verticales) en SVG, groupé ou empilé. Responsive, navigable au clavier
 * (flèches gauche/droite), avec infobulle au survol et au focus, et un tableau de données alternatif.
 */
export function BarChart({
  title,
  description,
  hideTitle = false,
  categories,
  categoryLabel = 'Catégorie',
  series,
  stacked = false,
  height = 280,
  formatValue = formatNumberFr,
  className,
}: BarChartProps) {
  const resolved = resolveSeries(series, categories.length);
  const { active, targetProps } = useCategoryNavigation(categories.length);
  const hintId = useId();

  // Domaine : le maximum d'une barre (groupé) ou d'une pile (empilé)
  const totals = categories.map((_, i) => resolved.reduce((sum, s) => sum + s.values[i], 0));
  const max = stacked ? Math.max(0, ...totals) : Math.max(0, ...resolved.flatMap((s) => s.values));
  const ticks = niceTicks(max);

  return (
    <ChartFrame
      title={title}
      description={description}
      hideTitle={hideTitle}
      categories={categories}
      categoryLabel={categoryLabel}
      series={resolved}
      formatValue={formatValue}
      legendShape="rect"
      className={className}
    >
      {(width) => {
        const margins: ChartMargins = { top: 8, right: 8, bottom: 28, left: yAxisWidth(ticks.map(formatValue)) };
        const plotWidth = Math.max(width - margins.left - margins.right, 1);
        const baseline = height - margins.bottom;
        const y = linearScale(0, ticks[ticks.length - 1], baseline, margins.top);
        const band = plotWidth / Math.max(categories.length, 1);
        const center = (i: number) => margins.left + band * (i + 0.5);

        // Largeur des barres : jamais plus de 24px, et toujours de l'air entre deux catégories
        const n = resolved.length;
        const room = band * 0.7;
        const barWidth = stacked
          ? Math.max(2, Math.min(MAX_BAR, room))
          : Math.max(2, Math.min(MAX_BAR, (room - GAP * (n - 1)) / n));
        const groupWidth = stacked ? barWidth : barWidth * n + GAP * (n - 1);

        const tooltip =
          active !== null ? (
            <ChartTooltip
              heading={categories[active]}
              rows={resolved.map((s) => ({ series: s, value: formatValue(s.values[active]) }))}
              total={stacked && n > 1 ? formatValue(totals[active]) : undefined}
              x={center(active)}
              y={y(stacked ? totals[active] : Math.max(...resolved.map((s) => s.values[active])))}
              containerWidth={width}
              placement="above"
            />
          ) : null;

        return (
          <>
            <svg
              className={chartStyles.svg}
              width={width}
              height={height}
              role="group"
              aria-label={title}
              aria-describedby={hintId}
            >
              <YGrid ticks={ticks} y={y} margins={margins} width={width} format={formatValue} />

              {/* Les barres : purement visuelles, les valeurs sont portées par les zones cibles */}
              <g aria-hidden="true">
                {categories.map((category, i) => {
                  const left = center(i) - groupWidth / 2;
                  // Dernière série non nulle de la pile : c'est elle qui porte l'extrémité arrondie
                  const topIndex = resolved.reduce((last, s, k) => (s.values[i] > 0 ? k : last), -1);
                  let stackBase = 0;
                  return (
                    <g key={category} className={cx(styles.group, active !== null && active !== i && styles.dimmed)}>
                      {resolved.map((s, k) => {
                        const value = s.values[i];
                        if (value <= 0) return null;
                        let x = left + k * (barWidth + GAP);
                        let top = y(value);
                        let bottom = baseline;
                        if (stacked) {
                          x = left;
                          bottom = y(stackBase);
                          stackBase += value;
                          top = y(stackBase);
                          // Espace de 2px au-dessus de chaque segment recouvert par un autre
                          if (k !== topIndex) top += GAP;
                        }
                        const h = bottom - top;
                        if (h <= 0) return null;
                        return (
                          <path
                            key={s.name}
                            className={cx(styles.bar, chartStyles[s.slot])}
                            d={topRoundedBar(x, top, barWidth, h, !stacked || k === topIndex)}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </g>

              <XLabels categories={categories} x={center} band={band} baseline={baseline} />

              {/* Zones cibles : toute la hauteur de la catégorie, bien plus grandes que la barre */}
              {categories.map((category, i) => (
                <rect
                  key={category}
                  {...targetProps(i)}
                  className={chartStyles.target}
                  x={margins.left + band * i}
                  y={margins.top}
                  width={band}
                  height={baseline - margins.top}
                  role="img"
                  aria-label={`${category} : ${resolved
                    .map((s) => `${s.name} ${formatValue(s.values[i])}`)
                    .join(', ')}${stacked && n > 1 ? `, total ${formatValue(totals[i])}` : ''}`}
                />
              ))}
            </svg>
            <span id={hintId} className={chartStyles.visuallyHidden}>
              {description ? `${description} ` : ''}Utilisez les flèches gauche et droite pour parcourir les
              valeurs.
            </span>
            {tooltip}
          </>
        );
      }}
    </ChartFrame>
  );
}
