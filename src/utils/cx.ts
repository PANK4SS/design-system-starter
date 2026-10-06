/** Assemble des classes CSS en ignorant les valeurs vides : cx('a', false && 'b', 'c') -> 'a c' */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
