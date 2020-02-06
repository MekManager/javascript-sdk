import { IEquity, IExperience, IStringify } from '../interfaces';
import { findLastIndex } from '../Utils/collections';
import { Attribute } from './attribute';
import { Learning, xpList } from './learning';
import { SkillBase } from './skillBase';

// TODO: write more documentation for this
export class Skill implements IEquity, IExperience, IStringify {
  public level: number;
  public xp: number;
  // NOTE: this might benefit from stricter typing.
  public subName?: string;
  public specialty?: string;
  public complexity: string;
  public links: Attribute | Attribute[];
  public targetNumber: number;

  private readonly _base: SkillBase;

  constructor (base: SkillBase) {
    this._base = base;
    this.xp = 0;
  }

  get name (): string {
    return this._base.name;
  }

  get targetNumbers (): [number, number?] {
    return this._base.targetNumbers;
  }

  get complexityRatings (): [string, string?] {
    return this._base.complexityRatings;
  }

  get linkedAttributes (): [Attribute, [Attribute, Attribute]?] {
    return this._base.linkedAttributes;
  }

  get tiered (): boolean {
    return this._base.tiered;
  }

  public addXP (xp: number, l: Learning): void {
    this.xp += xp;
    this._recalculate(l);
  }

  public removeXP (xp: number, l: Learning): void {
    this.xp -= xp;
    this._recalculate(l);
  }

  public setXP (xp: number, l: Learning): void {
    this.xp = xp;
    this._recalculate(l);
  }

  public toString (): string {
    let str = this._base.name;
    if (this.subName) {
      str = `${str}/${this.subName}`;
    }
    if (this.specialty) {
      str = `${str} (${this.specialty})`;
    }

    return str;
  }

  public equal (s: Skill): boolean {
    // TODO: Determine if there's a better way to do this
    return this.toString() === s.toString();
  }

  public xpValue (): number {
    return this.xp;
  }

  /**
   * A `Skill` has several properties that need to be calculated based on it's
   * XP. Like other objects that require re-calculating, the order that these
   * happen has some degree of importance. This ensures it happens in the right
   * order.
   *
   * @param l The learning of the character this skill belongs to
   */
  private _recalculate (l: Learning) {
    this._calculateLevel(l);
    this._calculateComplexity();
    this._calculateLinks();
    this._calculateTargetNumber();
  }

  /**
   * Determines and sets the level for the skill based on it's current XP.
   */
  private _calculateLevel (l: Learning): number {
    if (this.xp < 0) {
      this.level = 0;

      return this.level;
    }

    const value = findLastIndex((n) => this.xp >= n, xpList(l));
    this.level = value;

    return value;
  }

  private _calculateComplexity (): void {
    this.complexity = this._tieredValue<string>(this.complexityRatings);
  }

  private _calculateLinks (): void {
    this.links = this._tieredValue<Attribute | Attribute[]>(
      this.linkedAttributes
     );
  }

  private _calculateTargetNumber (): void {
    this.targetNumber = this._tieredValue<number>(this.targetNumbers);
  }

  /**
   * This method is tricky to understand.
   *
   * Some skills are "tiered"; which means that once the skill achieves a level
   * of 3 or higher it has different complexity, link values, and target
   * numbers. These are obviously three completely different values though,
   * so this method exists to generically determine if a tier needs to be used
   * and if so which one; and then return the appropriate value.
   *
   * @param subject The type of tiered value to be
   */
  private _tieredValue<T> (subject: [T, T?]): T {
    if (this.tiered && subject[1]) {
      return (this.level <= 3) ? subject[0] : subject[1];
    } else {
      return subject[0];
    }
  }
}
