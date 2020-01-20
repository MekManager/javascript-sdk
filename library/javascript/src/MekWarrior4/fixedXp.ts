import { Experience } from '../interfaces';
import { Attribute } from './attribute';

export class FixedXP {
  /** Indexes of chosen XP Sets */
  private _chosen: number[];

  constructor (
    /** The number of choices allowed for the set */
    public choices: number,
    public options: Attribute[] | Experience[],
    public xp: number
  ) {
    this._chosen = [];
  }

  /**
   * Returns if all available XP for this set has been allocated.
   */
  get complete (): boolean {
    return this._chosen.length === this.choices;
  }

  /**
   * Returns if XP still needs to be allocated.
   */
  get incomplete (): boolean {
    return !this.complete;
  }

  get forAttributes () {
    return typeof this.options[0] === 'string';
  }

  /**
   * Returns if a user is required to choose how they want the XP to be
   * allocated on a character.
   */
  get requiresChoices (): boolean {
    return this.options.length !== this.choices;
  }

  /**
   * Returns if no input is required from the user to allocate XP.
   */
  get canAutoAssign (): boolean {
    return !this.requiresChoices;
  }

  public take (index: number): void {
    this._chosen.push(index);
  }
}
