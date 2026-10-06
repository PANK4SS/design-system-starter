// Pièces internes partagées par BarChart et LineChart (non exportées par le design system).
export { ChartFrame } from './ChartFrame';
export type { ChartBaseProps } from './ChartFrame';
export { ChartTooltip } from './ChartTooltip';
export { YGrid, XLabels, yAxisWidth } from './ChartAxes';
export type { ChartMargins } from './ChartAxes';
export { niceTicks, linearScale, formatNumberFr, CHAR_WIDTH } from './scale';
export { resolveSeries, MAX_SERIES } from './series';
export type { ChartSeries, ChartColorSlot, ResolvedSeries } from './series';
export { useCategoryNavigation } from './useCategoryNavigation';
export { useElementWidth } from './useElementWidth';
