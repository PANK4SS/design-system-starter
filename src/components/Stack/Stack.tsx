import type { ElementType, HTMLAttributes, Ref } from 'react';
import { cx } from '../../utils/cx';
import styles from './Stack.module.css';

export type StackDirection = 'row' | 'column';
/** Espacements autorisés : les clés des tokens `space.*`. */
export type StackGap = '0' | '1' | '2' | '3' | '4' | '6' | '8' | '12' | '16';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Élément HTML rendu : `div` par défaut, `ul`, `section`, `nav`… selon le sens du contenu. */
  as?: ElementType;
  /** Sens d'empilement : `column` (vertical) par défaut, `row` (horizontal). */
  direction?: StackDirection;
  /** Espace entre les enfants, issu des tokens `space.*` (ex. `4` = 16px). */
  gap?: StackGap;
  /** Alignement sur l'axe secondaire (`align-items`). */
  align?: StackAlign;
  /** Répartition sur l'axe principal (`justify-content`). */
  justify?: StackJustify;
  /** Autorise le retour à la ligne des enfants quand la place manque. */
  wrap?: boolean;
  /** Référence vers l'élément rendu (React 19 : `ref` est une prop normale). */
  ref?: Ref<HTMLElement>;
}

/**
 * Primitive de mise en page : empile ses enfants en ligne ou en colonne avec un espacement
 * issu des tokens. Elle ne dessine rien (ni fond, ni bordure) : elle ne fait que placer.
 */
export function Stack({
  as: Component = 'div',
  direction = 'column',
  gap = '4',
  align,
  justify,
  wrap = false,
  className,
  ref,
  ...rest
}: StackProps) {
  const classes = cx(
    styles.stack,
    styles[direction],
    styles[`gap-${gap}`],
    align && styles[`align-${align}`],
    justify && styles[`justify-${justify}`],
    wrap && styles.wrap,
    className,
  );

  return <Component {...rest} ref={ref} className={classes} />;
}
