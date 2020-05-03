import { Character } from "../character";
import { ValidationError } from "../errorMessage";
import { Validator } from "./validator";
import { ValidatorFactory } from "./validatorFactory";

export class CharacterValidationService {
  public errors: ValidationError[];
  private _character: Character;
  private _validators: Validator[];

  constructor (character: Character) {
    this._character = character;
    this._validators = ValidatorFactory.validators(this._character);
  }

  get valid (): boolean {
    return this.errors.length === 0;
  }

  public validate (): boolean {
    this.errors = this._validators.reduce((errors, validator) => {
      if (validator.valid(this._character)) {
        return errors;
      } else {
        return errors.concat(validator.errors);
      }
    }, [] as ValidationError[]);

    return this.valid;
  }
}
