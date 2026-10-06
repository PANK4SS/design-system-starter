import { useId, useState, type ReactNode } from 'react';
import { Table2 } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Table, type TableColumn } from '../Table';
import type { ResolvedSeries } from './series';
import { useElementWidth } from './useElementWidth';
import styles from './Chart.module.css';
import a11y from '../../utils/visuallyHidden.module.css';

/** Props communes à tous les graphiques. */
export interface ChartBaseProps {
  /** Titre du graphique : affiché, et utilisé comme nom accessible et titre du tableau de données. */
  title: string;
  /** Phrase qui résume ce que montre le graphique (lue par les lecteurs d'écran). */
  description?: string;
  /** Masque visuellement le titre et la description (ex. déjà affichés par la carte parente). */
  hideTitle?: boolean;
  /** Libellés de l'axe X, dans l'ordre (ex. les mois). */
  categories: string[];
  /** Nom de la colonne des catégories dans le tableau de données (ex. « Mois »). */
  categoryLabel?: string;
  /** Hauteur de la zone de tracé en pixels, axe X compris. */
  height?: number;
  /** Formatage des valeurs (graduations, infobulle, tableau). Par défaut : nombres à la française. */
  formatValue?: (value: number) => string;
  className?: string;
}

interface ChartFrameProps {
  title: string;
  description?: string;
  hideTitle: boolean;
  categories: string[];
  categoryLabel: string;
  series: ResolvedSeries[];
  formatValue: (value: number) => string;
  /** Forme des pastilles de légende : carré pour les barres, trait pour les lignes. */
  legendShape: 'rect' | 'line';
  className?: string;
  /** Dessine le tracé à la largeur mesurée. */
  children: (width: number) => ReactNode;
}

interface DataRow {
  category: string;
  values: number[];
}

/**
 * Cadre commun des graphiques : titre, légende, zone de tracé responsive et tableau de
 * données alternatif (« Voir les données »), l'équivalent accessible de chaque graphique.
 */
export function ChartFrame({
  title,
  description,
  hideTitle,
  categories,
  categoryLabel,
  series,
  formatValue,
  legendShape,
  className,
  children,
}: ChartFrameProps) {
  const [plotRef, width] = useElementWidth<HTMLDivElement>();
  const [showData, setShowData] = useState(false);
  const tableId = useId();

  const columns: TableColumn<DataRow>[] = [
    { key: 'category', header: categoryLabel },
    ...series.map((s, index) => ({
      key: `s${index}`,
      header: s.name,
      align: 'end' as const,
      render: (row: DataRow) => formatValue(row.values[index]),
    })),
  ];
  const rows: DataRow[] = categories.map((category, i) => ({ category, values: series.map((s) => s.values[i]) }));

  return (
    <figure className={cx(styles.figure, className)}>
      <figcaption className={cx(styles.header, hideTitle && a11y.visuallyHidden)}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </figcaption>

      {/* Légende dès 2 séries : l'identité d'une série ne repose jamais sur la seule couleur */}
      {series.length >= 2 && (
        <ul className={styles.legend} aria-label="Légende">
          {series.map((s) => (
            <li key={s.name} className={cx(styles.legendItem, styles[s.slot])}>
              <span className={legendShape === 'line' ? styles.keyLine : styles.keyRect} aria-hidden="true" />
              {s.name}
            </li>
          ))}
        </ul>
      )}

      <div ref={plotRef} className={styles.plot}>
        {children(width)}
      </div>

      <div className={styles.footer}>
        <Button
          variant="ghost"
          size="sm"
          iconStart={<Icon icon={Table2} size="sm" />}
          aria-expanded={showData}
          aria-controls={tableId}
          onClick={() => setShowData((value) => !value)}
        >
          {showData ? 'Masquer les données' : 'Voir les données'}
        </Button>
      </div>

      <div id={tableId} hidden={!showData}>
        {showData && (
          <Table<DataRow>
            caption={title}
            columns={columns}
            rows={rows}
            density="compact"
            getRowKey={(row) => row.category}
          />
        )}
      </div>
    </figure>
  );
}
