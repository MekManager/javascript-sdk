import { FixedXP } from './fixedXp';
import { LifeStage } from './lifeStage';
import { Rule } from './rule';
import { RuleName } from './ruleName';

export class LifeModule {
  // TODO: in the future this should have an enum, or a small class instead of
  // just being a string.
  public fields: string[];

  constructor (
    public stage: LifeStage,
    public name: string,
    public rules: Rule[],
    public fixedXps: FixedXP[],
    public isClan = false
  ) {
    this.fields = [];
  }

  public hasRuleFor (name: RuleName): boolean {
    return this._ruleFor(name) !== undefined;
  }

  private _ruleFor (name: RuleName): Rule {
    return this.rules.find(r => r.name === name);
  }
}
