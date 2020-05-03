import { Character } from "../character";
import { ValidationError } from "../errorMessage";
import { Validator } from "./validator";

export class TraitNotAboveMinimumValidator implements Validator {
  public name: string;
  public errors: ValidationError[];

  private readonly _config: {};

  constructor (config: {}) {
    this.name = 'Trait Not Above Minimum Validator';
    this.errors = [];

    this._config = config;
  }

  public valid (character: Character): boolean {
    this.errors = [];
    const traitName: string = this._config['trait'];
    const trait = character.getTrait(traitName);

    if (trait === undefined) {
      // Trait doesn't even exist for there to be an issue with it
      return true;
    }

    if (trait.levelAboveMinimum) {
      this.errors.push({
        message: `The trait ${traitName} cannot be above it's minimum value of ${trait.min}`,
        origin: this.name,
      });

      return false;
    } else {
      return true;
    }
  }
}
