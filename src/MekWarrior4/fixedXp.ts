import { IExperience } from '../interfaces';
import { Attribute } from './attribute';
import { Skill } from './skill';
import { Trait } from './trait';

export class FixedXP {
  /** Indexes of chosen XP Sets */
  private _chosen: number[];

  constructor (
    /** The number of choices allowed for the set */
    public choices: number,
    public options: Attribute[] | IExperience[],
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
    // TODO: There's some issue with incompatible types in the union that
    // options can be so I'm forcing it to be an array of anything here. I do
    // want to re-think how I've set the types up later on, come back to this
    // then.
    const requireSubDescriptions = (this.options as any[]).filter(o => {
      if (o instanceof Skill || o instanceof Trait) {
        // TODO: decide if a choice of any should be represented by the actual
        // word "Any", or use a "*". The star could be more compatible for i18n
        return o.subName === 'Any';
      } else {
        return false;
      }
    }).length !== 0;

    return (this.options.length !== this.choices) || requireSubDescriptions;
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
