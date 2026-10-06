import type { HTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styles from './Pagination.module.css';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Page courante (commence à 1). Le composant est contrôlé. */
  page: number;
  /** Nombre total de pages. */
  totalPages: number;
  /** Appelé avec le numéro de la page demandée. */
  onPageChange: (page: number) => void;
  /** Nombre de pages affichées de chaque côté de la page courante avant les points de suspension. */
  siblingCount?: number;
  /** Nom accessible du bloc de navigation. */
  'aria-label'?: string;
}

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * Calcule les pages à afficher : toujours la première et la dernière, la page courante entourée
 * de `siblingCount` voisines, et des points de suspension pour les trous.
 * Ex. (page 6 sur 20, 1 voisine) : 1 … 5 6 7 … 20
 */
export function getPageTokens(page: number, totalPages: number, siblingCount = 1): PageToken[] {
  // 1re + dernière + courante + voisines + 2 points de suspension
  const maxSlots = siblingCount * 2 + 5;
  if (totalPages <= maxSlots) return range(1, totalPages);

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, totalPages);
  const showStartEllipsis = left > 3;
  const showEndEllipsis = right < totalPages - 2;

  if (!showStartEllipsis) {
    return [...range(1, 3 + siblingCount * 2), 'ellipsis-end', totalPages];
  }
  if (!showEndEllipsis) {
    return [1, 'ellipsis-start', ...range(totalPages - (2 + siblingCount * 2), totalPages)];
  }
  return [1, 'ellipsis-start', ...range(left, right), 'ellipsis-end', totalPages];
}

/**
 * Pagination : navigation entre les pages d'une liste ou d'un tableau.
 * La page courante porte `aria-current="page"` ; Précédente / Suivante sont désactivés aux extrémités.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  'aria-label': ariaLabel = 'Pagination',
  className,
  ...rest
}: PaginationProps) {
  if (totalPages < 1) return null;
  const tokens = getPageTokens(page, totalPages, siblingCount);

  return (
    <nav {...rest} aria-label={ariaLabel} className={cx(styles.pagination, className)}>
      <ul className={styles.list}>
        <li>
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            iconStart={<Icon icon={ChevronLeft} size="sm" />}
          >
            Précédente
          </Button>
        </li>

        {tokens.map((token) =>
          typeof token === 'number' ? (
            <li key={token}>
              <button
                type="button"
                className={styles.page}
                aria-current={token === page ? 'page' : undefined}
                // « Page 3 » plutôt que « 3 » : plus clair hors contexte pour un lecteur d'écran
                aria-label={`Page ${token}`}
                onClick={() => token !== page && onPageChange(token)}
              >
                {token}
              </button>
            </li>
          ) : (
            // Points de suspension décoratifs : les numéros de page suffisent à comprendre le saut
            <li key={token} className={styles.ellipsis} aria-hidden="true">
              <Icon icon={Ellipsis} size="sm" />
            </li>
          ),
        )}

        <li>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            iconEnd={<Icon icon={ChevronRight} size="sm" />}
          >
            Suivante
          </Button>
        </li>
      </ul>
    </nav>
  );
}
