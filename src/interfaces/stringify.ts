/**
 * Interface guaranteeing that a class can be represented in string format.
 */
export interface IStringify {
  toString (): string;
}

/**
 * A function to turns an object into a string. Useful for `map` and other
 * iterables.
 *
 * @param s Some Stringifyable value
 */
export const toString = (s: IStringify) => s.toString();
