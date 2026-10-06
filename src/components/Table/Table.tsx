import { useId, type CSSProperties, type ReactNode, type Ref } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Table.module.css';

export type TableAlign = 'start' | 'center' | 'end';
export type TableDensity = 'compact' | 'comfortable';
export type TableSortDirection = 'ascending' | 'descending';

export interface TableSort {
  /** Clé de la colonne triée. */
  key: string;
  /** Sens du tri, avec les mêmes valeurs que l'attribut `aria-sort`. */
  direction: TableSortDirection;
}

export interface TableColumn<Row> {
  /** Identifiant de la colonne ; par défaut, c'est aussi le champ de la ligne affiché. */
  key: string;
  /** Texte de l'en-tête de colonne. */
  header: ReactNode;
  /** Alignement du contenu : `end` pour les nombres, pour qu'ils s'alignent sur les unités. */
  align?: TableAlign;
  /** Rend l'en-tête cliquable pour trier (le tri lui-même est fait par le parent). */
  sortable?: boolean;
  /** Rendu personnalisé d'une cellule (badge, lien, montant formaté…). */
  render?(row: Row, rowIndex: number): ReactNode;
}

export interface TableProps<Row> {
  /** Titre du tableau, OBLIGATOIRE : c'est lui qui annonce le tableau aux lecteurs d'écran. */
  caption: ReactNode;
  /** Masque visuellement le titre (il reste lu par les lecteurs d'écran). */
  hideCaption?: boolean;
  /** Définition des colonnes, dans l'ordre d'affichage. */
  columns: TableColumn<Row>[];
  /** Les lignes à afficher, déjà triées par le parent. */
  rows: Row[];
  /** Clé React stable d'une ligne (ex. son identifiant). Par défaut : son index. */
  getRowKey?: (row: Row, rowIndex: number) => string | number;
  /** Tri actuel (contrôlé). `null` ou absent : aucun tri affiché. */
  sort?: TableSort | null;
  /** Appelé avec le tri demandé quand l'utilisateur clique sur un en-tête triable. */
  onSortChange?: (sort: TableSort) => void;
  /** Hauteur des lignes : `compact` pour beaucoup de données, `comfortable` pour la lecture. */
  density?: TableDensity;
  /** Alterne la couleur de fond des lignes pour suivre une ligne longue du regard. */
  striped?: boolean;
  /** Garde la ligne d'en-tête visible pendant le défilement vertical (à combiner avec `maxHeight`). */
  stickyHeader?: boolean;
  /** Hauteur maximale de la zone de défilement (ex. `'20rem'`), utile avec `stickyHeader`. */
  maxHeight?: CSSProperties['maxHeight'];
  /** Contenu affiché quand `rows` est vide. */
  emptyState?: ReactNode;
  className?: string;
  /** Référence vers l'élément `<table>`. */
  ref?: Ref<HTMLTableElement>;
}

/** Lit la valeur brute d'une cellule quand la colonne n'a pas de `render`. */
function readCell(row: unknown, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  return typeof value === 'string' || typeof value === 'number' ? value : null;
}

const sortIcons = { ascending: ArrowUp, descending: ArrowDown } as const;

/**
 * Tableau de données accessible. Le composant n'ordonne rien lui-même : il affiche le tri
 * demandé (`sort`) et prévient le parent (`onSortChange`), qui trie les lignes.
 */
export function Table<Row>({
  caption,
  hideCaption = false,
  columns,
  rows,
  getRowKey = (_row, index) => index,
  sort = null,
  onSortChange,
  density = 'comfortable',
  striped = false,
  stickyHeader = false,
  maxHeight,
  emptyState = 'Aucune donnée à afficher.',
  className,
  ref,
}: TableProps<Row>) {
  const captionId = useId();

  return (
    // La zone défile horizontalement sur petit écran : elle doit être atteignable au clavier
    // et porter un nom, sinon un utilisateur clavier ne peut pas faire défiler le tableau.
    <div
      className={cx(styles.scroller, stickyHeader && styles.sticky, className)}
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table ref={ref} className={cx(styles.table, styles[density], striped && styles.striped)}>
        <caption id={captionId} className={cx(styles.caption, hideCaption && styles.visuallyHidden)}>
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const align = column.align ?? 'start';
              const sorted = sort?.key === column.key ? sort.direction : undefined;
              const sortable = column.sortable && onSortChange;
              // Un clic sur la colonne déjà triée en ordre croissant inverse le sens ; sinon on part du croissant.
              const next: TableSortDirection = sorted === 'ascending' ? 'descending' : 'ascending';

              return (
                <th
                  key={column.key}
                  scope="col"
                  className={cx(styles.headerCell, styles[align])}
                  // aria-sort uniquement sur la colonne triée : c'est ce que recommande l'APG
                  aria-sort={sorted}
                >
                  {sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => onSortChange({ key: column.key, direction: next })}
                    >
                      <span>{column.header}</span>
                      <Icon
                        icon={sorted ? sortIcons[sorted] : ArrowUpDown}
                        size="sm"
                        className={cx(styles.sortIcon, !sorted && styles.sortIconIdle)}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={getRowKey(row, rowIndex)} className={styles.row}>
                {columns.map((column) => (
                  <td key={column.key} className={cx(styles.cell, styles[column.align ?? 'start'])}>
                    {column.render ? column.render(row, rowIndex) : readCell(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
