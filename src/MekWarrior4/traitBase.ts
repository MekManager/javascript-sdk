export class TraitBase {
  /** The name of the `Trait` */
  public readonly name: string;
  /** If a character is allowed to have multiple of this trait. */
  public readonly multipleAllowed: boolean;
  /** The maximum `points` this trait can have. */
  public readonly max?: number;
  /** The minimum `points` this trait can have. */
  public readonly min?: number;
  /**
   * If the trait is has negative XP, i.e. gives the character XP _back_ for
   * taking it.
   */
  public readonly negative: boolean;

  constructor (data: Object) {
    this.name = data['name'] || '';
    this.multipleAllowed = data['multipleAllowed'] || false;
    this.max = data['max'];
    this.min = data['min'];
    this.negative = data['negative'] || false;
  }

  /**
   * Determines if the given level would be above this traits maximum value.
   *
   * @param level The level to compare with this trait's maximum level
   */
  public levelAboveMaximum (level: number): boolean {
    if (this.max === undefined) {
      // The level can't be over a limit that doesn't exist
      return false;
    }

    return Math.abs(level) > Math.abs(this.max);
  }

  /**
   * Determines if the given level would be below this traits minimum value.
   *
   * @param level The level to compare with this trait's minimum level
   */
  public levelAboveMinimum (level: number): boolean {
    if (this.min === undefined) {
      // The level can't be above a limit that doesn't exist
      return false;
    }

    return Math.abs(level) > Math.abs(this.min);
  }

  /**
   * Determines if the given level would be equal to this trait's maximum value.
   *
   * @param level The level to compare with this trait's maximum value.
   */
  public levelAtMaximum (level: number): boolean {
    if (this.max === undefined) {
      return false;
    }

    return Math.abs(level) === Math.abs(this.max);
  }

  /**
   * Determines if the given level would be equal to this trait's minimum value.
   *
   * @param level The level to compare with this trait's minimum value.
   */
  public levelAtMinimum (level: number): boolean {
    if (this.min === undefined) {
      return false;
    }

    return Math.abs(level) === Math.abs(this.min);
  }

  /**
   * Determines if the given level would be under this trait's maximum value.
   *
   * @param level The level to compare with this trait's maximum value.
   */
  public levelUnderMaximum (level: number): boolean {
    if (this.max === undefined) {
      // The level can't be over a limit that doesn't exist
      return false;
    }

    return Math.abs(level) > Math.abs(this.max);
  }

  /**
   * Determines if the given level would be under this trait's maximum value.
   *
   * @param level The level to compare with this trait's minimum value.
   */
  public levelUnderMinimum (level: number): boolean {
    if (this.min === undefined) {
      // The level can't be under a limit that doesn't exist
      return false;
    }

    return Math.abs(level) < Math.abs(this.min);
  }

}
