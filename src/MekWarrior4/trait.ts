import { IEquity, IExperience, IStringify } from '../interfaces';
import { LifeStage } from './lifeStage';
import { TraitBase } from './traitBase';

export class Trait implements IEquity, IExperience, IStringify {
  /** The amount of Trait Points or TP a trait has. */
  public level: number;
  /** The amount of raw XP a trait has. */
  public xp: number;
  /**
   * A further description of a trait, usually to differentiate a trait taken
   * multiple times.
   */
  public subName?: string;
  /**
   * Further clarification on a `subDescription`. This is useful in
   * situations where there's multiple of the same thing. i.e:
   *
   *   Dependent (-2)/Son (Albert)
   *
   *   Dependent (-2)/Son (Brent)
   */
  public subject?: string;
  /**
   * If a character has multiple identities, this specifies which of those
   * identities this belongs to.
   */
  public identity?: string;
  /**
   * This is a special field related to phenotypes
   */
  public type?: string;
  /**
   * The stage this trait was assigned to the character.
   */
  public stageTaken?: LifeStage;

  private readonly _base: TraitBase;

  constructor (base: TraitBase) {
    this._base = base;
    this.xp = 0;
    this.level = this._calculateLevel(0);
  }

/**
 * Determines if this `Trait` is currently active.
 *
 * @returns if the trait is actively effecting a character
 */
  get isActive (): boolean {
    return this.level !== 0;
  }

  /**
   * The base name of this `Trait`.
   */
  get name (): string {
    return this._base.name;
  }

  /**
   * Determines if this trait's level is above it's minimum value.
   */
  get levelAboveMinimum (): boolean {
    return this._base.levelAboveMinimum(this.level);
  }

  /**
   * Determines if this trait's level is at it's maximum value.
   */
  get levelAtMaximum (): boolean {
    return this._base.levelAtMaximum(this.level);
  }

  /**
   * Determines if this trait's level is at it's minimum value.
   */
  get levelAtMinimum (): boolean {
    return this._base.levelAtMinimum(this.level);
  }

  /**
   * Determines if this trait's level is below it's maximum value.
   */
  get levelUnderMaximum (): boolean {
    return this._base.levelUnderMaximum(this.level);
  }

  /**
   * If a character can have instances of this trait.
   */
  get multipleAllowed (): boolean {
    return this._base.multipleAllowed;
  }

  /**
   * The maximum level this trait can be at.
   */
  get max (): number | undefined {
    return this._base.max;
  }

  /**
   * The minimum level for this trait to be considered active.
   */
  get min (): number | undefined {
    return this._base.min;
  }

  /**
   * If the trait is has negative XP, i.e. gives the character XP _back_ for
   * taking it.
   */
  get negative (): boolean {
    return this._base.negative;
  }

  /**
   * Adds the given amount of XP to be added to this `Trait`.
   *
   * @param xp The amount of XP to add
   */
  public addXP (xp: number): void {
    this.xp += xp;
    this.level = this._calculateLevel(this.xp);
  }

  public equal (trait: Trait): boolean {
    return this._compareForXPString() === trait._compareForXPString();
  }

  /**
   * Sets the XP of this `Trait` to the given amount.
   *
   * @param xp The amount of XP to set
   */
  public setXP (xp: number): void {
    this.xp = xp;
    this.level = this._calculateLevel(this.xp);
  }

  /**
   * Removes the given amount of XP from this `Trait`.
   *
   * @param xp The amount of XP to remove
   */
  public removeXP (xp: number): void {
    this.xp -= xp;
    this.level = this._calculateLevel(this.xp);
  }

  /**
   * The string representation of this `Trait`.
   */
  public toString (): string {
    let str = this.name;

    if (this.type) {
      str =`${str}: ${this.type}`;
    }
    if (this.isActive) {
      str = `${str} (${this.level})`;
    }
    if (this.subName) {
      str = `${str}/${this.subName}`;
    }
    if (this.subject) {
      str = `${str} (${this.subject})`;
    }

    return str;
  }

  /**
   * This trait's current XP
   */
  public xpValue (): number {
    return this.xp;
  }

  private _calculateLevel (xp: number): number {
    const level = Math.floor(xp / 100);


    if (this._base.levelAboveMaximum(level)) {
      return this.max || 0;
    } else if (this._base.levelUnderMinimum(level)) {
      return 0;
    } else {
      return level;
    }
  }

  // Same as the `toString` method except without any value related to XP so
  // it can be used to determine if it's the same trait to add XP to.
  private _compareForXPString (): string {
    let str = this.name;

    if (this.type) {
      str =`${str}: ${this.type}`;
    }
    if (this.subName) {
      str = `${str}/${this.subName}`;
    }
    if (this.subject) {
      str = `${str} (${this.subject})`;
    }

    return str;
  }
}
