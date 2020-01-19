/**
 * Describes objects with the ability to determine if another instance is
 * equal to itself.
 */
export interface Equity {
  /**
   * Determines if another instance of the same class is equal to the caller.
   *
   * @param x another instance of the same class
   */
  equal (x: this): boolean;
}
