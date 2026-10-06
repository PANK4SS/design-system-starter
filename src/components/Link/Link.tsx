import type { AnchorHTMLAttributes } from 'react';
import { ExternalLink } from 'lucide-react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'subtle';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Adresse de destination. Un lien sert à NAVIGUER ; pour une action, utiliser `Button`. */
  href?: string;
  /** `default` : texte principal ; `subtle` : texte secondaire (pied de page, métadonnées, fil d'Ariane). */
  variant?: LinkVariant;
  /**
   * Lien vers un autre site : ouvre un nouvel onglet (`target="_blank"`, `rel="noopener noreferrer"`),
   * ajoute une icône et annonce « (nouvel onglet) » aux lecteurs d'écran.
   */
  external?: boolean;
}

/**
 * Lien hypertexte stylé. Il est TOUJOURS souligné : la couleur seule ne suffit pas
 * à distinguer un lien du texte qui l'entoure (WCAG 1.4.1).
 */
export function Link({ variant = 'default', external = false, className, children, target, rel, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      className={cx(styles.link, styles[variant], className)}
      target={external ? '_blank' : target}
      // noopener : la page ouverte ne peut pas manipuler la nôtre ; noreferrer : on ne transmet pas l'URL d'origine
      rel={external ? 'noopener noreferrer' : rel}
    >
      {children}
      {external && (
        <>
          <Icon icon={ExternalLink} size="sm" className={styles.icon} />
          <span className={styles.srOnly}>(nouvel onglet)</span>
        </>
      )}
    </a>
  );
}
