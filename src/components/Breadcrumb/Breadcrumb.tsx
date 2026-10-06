import type { HTMLAttributes } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import { Link } from '../Link';
import styles from './Breadcrumb.module.css';

/** Une étape du fil d'Ariane. */
export interface BreadcrumbItem {
  /** Nom de la page. */
  label: string;
  /** Adresse de la page. Facultative pour la dernière étape (la page courante). */
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Étapes, de la racine du site jusqu'à la page courante (la dernière). */
  items: BreadcrumbItem[];
  /** Nom accessible du bloc de navigation. */
  'aria-label'?: string;
}

/**
 * Fil d'Ariane : situe la page courante dans l'arborescence du site.
 * La dernière étape porte `aria-current="page"` ; les chevrons sont décoratifs.
 */
export function Breadcrumb({ items, 'aria-label': ariaLabel = "Fil d'Ariane", className, ...rest }: BreadcrumbProps) {
  return (
    <nav {...rest} aria-label={ariaLabel} className={cx(styles.breadcrumb, className)}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {isCurrent ? (
                // Page courante : un lien vers soi-même (si href) ou un simple texte, marqué aria-current
                item.href ? (
                  <a href={item.href} aria-current="page" className={styles.current}>
                    {item.label}
                  </a>
                ) : (
                  <span aria-current="page" className={styles.current}>
                    {item.label}
                  </span>
                )
              ) : (
                <>
                  <Link href={item.href} variant="subtle">
                    {item.label}
                  </Link>
                  <Icon icon={ChevronRight} size="sm" className={styles.separator} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
