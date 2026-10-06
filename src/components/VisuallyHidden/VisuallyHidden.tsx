import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import a11y from '../../utils/visuallyHidden.module.css';

export type VisuallyHiddenProps = ComponentProps<'span'>;

/**
 * Texte invisible à l'écran mais lu par les lecteurs d'écran.
 * Ex. : préciser « (nouvel onglet) » après un lien, ou nommer un bouton qui n'affiche qu'une icône.
 */
export function VisuallyHidden({ className, ...rest }: VisuallyHiddenProps) {
  return <span {...rest} className={cx(a11y.visuallyHidden, className)} />;
}
