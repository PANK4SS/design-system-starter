import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import styles from './Card.module.css';

export type CardVariant = 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardElement = 'div' | 'article' | 'section';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** `outlined` : bordure fine, pour les listes et grilles. `elevated` : ombre portée, pour une carte mise en avant. */
  variant?: CardVariant;
  /** Marge intérieure, partagée par toutes les sous-parties (`CardHeader`, `CardBody`, `CardFooter`). */
  padding?: CardPadding;
  /**
   * Carte entièrement cliquable. À combiner OBLIGATOIREMENT avec un `CardLink` placé dans le titre :
   * c'est lui, un vrai `<a>` ou `<button>`, qui reçoit le focus et le clic (motif du « lien étiré »).
   * La carte, elle, ne fait qu'afficher les styles de survol et de focus.
   */
  interactive?: boolean;
  /** Élément HTML rendu : `article` pour un contenu autonome (une alerte, un rapport), `section` pour une zone titrée. */
  as?: CardElement;
}

/**
 * Conteneur visuel qui regroupe des informations liées.
 *
 * Accessibilité d'une carte cliquable : on n'ajoute JAMAIS `onClick` sur la carte elle-même
 * (un `<div>` cliquable n'est ni focusable ni annoncé). On place un `CardLink` dans le titre :
 * son pseudo-élément couvre toute la carte, le lecteur d'écran n'annonce que le titre,
 * et les autres boutons de la carte restent utilisables au-dessus.
 */
export function Card({
  variant = 'outlined',
  padding = 'md',
  interactive = false,
  as: Element = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Element
      {...rest}
      className={cx(styles.card, styles[variant], styles[`padding-${padding}`], interactive && styles.interactive, className)}
    >
      {children}
    </Element>
  );
}

/* ── En-tête ─────────────────────────────────────────────────────────────── */

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Titre de la carte. Peut contenir un `CardLink` pour rendre la carte cliquable. */
  title: ReactNode;
  /** Ligne secondaire sous le titre (date, lieu, statut…). */
  subtitle?: ReactNode;
  /** Zone d'actions à droite du titre (bouton, menu, badge…). Reste cliquable sur une carte interactive. */
  actions?: ReactNode;
  /** Niveau de titre, à choisir selon la hiérarchie de la page. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

export function CardHeader({ title, subtitle, actions, titleAs: Heading = 'h3', className, ...rest }: CardHeaderProps) {
  return (
    <div {...rest} className={cx(styles.header, className)}>
      <div className={styles.headings}>
        <Heading className={styles.title}>{title}</Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

/* ── Corps et pied ───────────────────────────────────────────────────────── */

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export function CardBody({ className, ...rest }: CardBodyProps) {
  return <div {...rest} className={cx(styles.body, className)} />;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Alignement des actions du pied de carte. */
  align?: 'start' | 'end' | 'between';
}

export function CardFooter({ align = 'end', className, ...rest }: CardFooterProps) {
  return <div {...rest} className={cx(styles.footer, styles[`align-${align}`], className)} />;
}

/* ── Média ───────────────────────────────────────────────────────────────── */

export interface CardMediaProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  /** Texte alternatif OBLIGATOIRE. Passer `""` seulement si l'image est purement décorative. */
  alt: string;
}

/** Image pleine largeur. À placer en premier enfant de la carte pour qu'elle touche les bords. */
export function CardMedia({ className, alt, ...rest }: CardMediaProps) {
  return <img {...rest} alt={alt} className={cx(styles.media, className)} />;
}

/* ── Lien étiré ──────────────────────────────────────────────────────────── */

type CardLinkAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type CardLinkAsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/**
 * Rend toute une carte `interactive` cliquable.
 * - avec `href` : un vrai lien `<a>` (pour NAVIGUER vers une page) ;
 * - sans `href` : un vrai `<button>` (pour une ACTION, ex. ouvrir un panneau).
 */
export type CardLinkProps = CardLinkAsLink | CardLinkAsButton;

export function CardLink(props: CardLinkProps) {
  if (props.href !== undefined) {
    const { className, ...rest } = props as CardLinkAsLink;
    // oxlint-disable-next-line jsx-a11y/anchor-has-content -- le contenu (children) arrive via ...rest
    return <a {...rest} className={cx(styles.link, className)} />;
  }
  const { className, type = 'button', ...rest } = props as CardLinkAsButton;
  return <button {...rest} type={type} className={cx(styles.link, styles.linkButton, className)} />;
}
