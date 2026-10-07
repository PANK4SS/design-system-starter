import { useId } from 'react';
import {
  CHAR_WIDTH,
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
import styles from './LineChart.module.css';
import a11y from '../../utils/visuallyHidden.module.css';

export interface LineChartProps extends ChartBaseProps {
  /**
   * Les séries à suivre dans le temps (5 au maximum : au-delà, les suivantes sont additionnées
   * dans « Autre », ce qui n'a de sens que pour des quantités, pas pour des taux).
   */
  series: ChartSeries[];
  /** Affiche un point sur chaque valeur (utile avec peu de points, ou pour l'impression). */
  showMarkers?: boolean;
}

/** Rayon des points : 4px, soit 8px de diamètre, le minimum lisible. */
const MARKER_RADIUS = 4;

/**
 * Courbe d'évolution en SVG, une ou plusieurs séries sur UN seul axe Y. Responsive, réticule
 * vertical au survol et au clavier (flèches gauche/droite), infobulle listant toutes les séries,
 * et tableau de données alternatif.
 */
export function LineChart({
  title,
  description,
  hideTitle = false,
  categories,
  categoryLabel = 'Période',
  series,
  showMarkers = false,
  height = 280,
  formatValue = formatNumberFr,
  className,
}: LineChartProps) {
  const resolved = resolveSeries(series, categories.length);
  const { active, targetProps } = useCategoryNavigation(categories.length);
  const hintId = useId();

  const max = Math.max(0, ...resolved.flatMap((s) => s.values));
  const ticks = niceTicks(max);
  const count = categories.length;

  return (
    <ChartFrame
      title={title}
      description={description}
      hideTitle={hideTitle}
      categories={categories}
      categoryLabel={categoryLabel}
      series={resolved}
      formatValue={formatValue}
      legendShape="line"
      className={className}
    >
      {(width) => {
        // Les libellés X sont centrés sur les points : il faut une demi-étiquette de marge aux deux bouts
        const halfLabel = (label = '') => (label.length * CHAR_WIDTH) / 2 + 4;
        const margins: ChartMargins = {
          top: 8,
          right: Math.max(MARKER_RADIUS + 4, halfLabel(categories[count - 1])),
          bottom: 28,
          left: Math.max(yAxisWidth(ticks.map(formatValue)), halfLabel(categories[0])),
        };
        const plotWidth = Math.max(width - margins.left - margins.right, 1);
        const baseline = height - margins.bottom;
        const y = linearScale(0, ticks[ticks.length - 1], baseline, margins.top);
        const step = count > 1 ? plotWidth / (count - 1) : 0;
        const x = (i: number) => (count > 1 ? margins.left + i * step : margins.left + plotWidth / 2);
        const path = (values: number[]) => values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');

        // Zone cible de chaque point : de la moitié du point précédent à la moitié du suivant
        // (bornée à la zone de tracé ; avec un seul point, toute la zone)
        const plotRight = margins.left + plotWidth;
        const hitLeft = (i: number) => (count > 1 ? Math.max(margins.left, x(i) - step / 2) : margins.left);
        const hitRight = (i: number) => (count > 1 ? Math.min(plotRight, x(i) + step / 2) : plotRight);

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

              {/* Réticule : un trait vertical fin qui se cale sur la position X la plus proche */}
              {active !== null && (
                <line
                  aria-hidden="true"
                  className={styles.crosshair}
                  x1={x(active)}
                  x2={x(active)}
                  y1={margins.top}
                  y2={baseline}
                />
              )}

              <g aria-hidden="true">
                {resolved.map((s) => (
                  <g key={s.name} className={chartStyles[s.slot]}>
                    <path className={styles.line} d={path(s.values)} />
                    {s.values.map((v, i) => {
                      // Toujours un point au bout de la courbe ; ailleurs, seulement sur demande ou au survol
                      const visible = showMarkers || i === count - 1 || i === active;
                      return visible ? (
                        <circle key={i} className={styles.marker} cx={x(i)} cy={y(v)} r={MARKER_RADIUS} />
                      ) : null;
                    })}
                  </g>
                ))}
              </g>

              <XLabels categories={categories} x={x} band={step || plotWidth} baseline={baseline} />

              {categories.map((category, i) => (
                <rect
                  key={category}
                  {...targetProps(i)}
                  className={chartStyles.target}
                  x={hitLeft(i)}
                  y={margins.top}
                  width={hitRight(i) - hitLeft(i)}
                  height={baseline - margins.top}
                  role="img"
                  aria-label={`${category} : ${resolved.map((s) => `${s.name} ${formatValue(s.values[i])}`).join(', ')}`}
                />
              ))}
            </svg>
            <span id={hintId} className={a11y.visuallyHidden}>
              {description ? `${description} ` : ''}Utilisez les flèches gauche et droite pour parcourir les valeurs.
            </span>
            {active !== null && (
              <ChartTooltip
                heading={categories[active]}
                rows={resolved.map((s) => ({ series: s, value: formatValue(s.values[active]) }))}
                x={x(active)}
                y={margins.top}
                containerWidth={width}
                placement="side"
              />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
