import { IEquity, IExperience, toString } from '../interfaces';
import { Attribute } from './attribute';
import { Attributes } from './attributes';
import { CharacterFlavor, newCharacterFlavor } from './characterFlavor';
import { CharacterLifeModule } from './characterLifeModule';
import { ClanCaste } from './clanCaste';
import { FixedXP } from './fixedXp';
import { Learning } from './learning';
import { LifeModule } from './lifeModule';
import { LifeStage } from './lifeStage';
import { Name } from './name';
import { Skill } from './skill';
import { Trait } from './trait';

export class Character implements IExperience {
  public name: Name;
  public xp: number;
  public flavor: CharacterFlavor;
  public attributes: Attributes;
  public skills: Skill[];
  public traits: Trait[];
  /** For Clan characters */
  public caste?: ClanCaste;

  private _affiliations: CharacterLifeModule[];
  private _lifeModules: CharacterLifeModule[];
  private _learning: Learning;

  constructor () {
    this.name = new Name();
    this.xp = 0;
    this._affiliations = [];
    this._lifeModules = [];
    this.flavor = newCharacterFlavor();
    this.attributes = new Attributes();
    this.skills = [] as Skill[];
    this.traits = [] as Trait[];
  }

  /**
   * Returns all life modules, regardless of if they are currently active.
   */
  get lifeModules (): CharacterLifeModule[] {
    return this._lifeModules;
  }

  /**
   * The first affiliation a character took.
   */
  get originalAffiliation (): CharacterLifeModule {
    return this.affiliations()[0];
  }

  /**
   * The affiliation this character currently holds.
   */
  get currentAffiliation (): CharacterLifeModule {
    const modules = this.affiliations();

    return modules[modules.length - 1];
  }

  /**
   * Returns an array of all life modules that are currently active on the
   * character. For example, this excludes any affiliation other than the most
   * recent one, as only rules from the most recent (i.e. "active") affiliation
   * count.
   */
  get activeLifeModules (): CharacterLifeModule[] {
    const nonAffilations = this._lifeModules.filter(
      lm => lm.stage !== LifeStage.AFFILIATION
    );
    const currentAffiliation = this.currentAffiliation;

    if (currentAffiliation) {
      return [ currentAffiliation, ...nonAffilations ];
    } else {
      return nonAffilations;
    }
  }

  get learning (): Learning {
    if (this._learning) {
      return this._learning;
    }

    // TODO: find a better way to determine learning traits than literally
    // searching for their names as strings
    const slow = this.traits.find(t => t.name === 'Slow Learner');

    if (slow?.isActive) {
      this._learning = Learning.SLOW;

      return this._learning;
    }

    const fast = this.traits.find(t => t.name === 'Fast Learner');

    if (fast?.isActive) {
      this._learning = Learning.FAST;

      return this._learning;
    }

    this._learning = Learning.STANDARD;

    return this._learning;
  }

  /**
   * Adds a trait onto this characters list of traits.
   *
   * @param trait The trait to be added to this character's list of traits.
   */
  public addTrait (trait: Trait): void {
    this.traits.push(trait);
  }

  /**
   * Adds the given XP amount to this `Character`.
   *
   * @param xp The amount of XP to be added
   */
  public addXP (xp: number): void {
    this.xp += xp;
  }

  /**
   * Sets the given XP amount to this `Character`.
   *
   * @param xp The amount of XP to be set
   */
  public setXP (xp: number): void {
    this.xp = xp;
  }

  /**
   * Removes the given XP amount from this `Character`.
   *
   * @param xp The amount of XP to remove
   */
  public removeXP (xp: number): void {
    this.xp -= xp;
  }

  /**
   * Adds the provided `LifeModule` to this character as an affiliation. The
   * `LifeModule` provided will become this characters latest (i.e. active)
   * affiliation.
   *
   * @param lm The `LifeModule` to add to this character.
   */
  public addAffiliation (lm: LifeModule): void {
    this.addLifeModule(LifeStage.AFFILIATION, lm);
  }

  /**
   * Adds the provided `LifeModule` at the given `LifeStage` of this
   * character's life. These will be constructed into  a `CharacterLifeModule`
   * and if the optional field is provided it will be associated with the
   * `CharacterLifeModule`.
   *
   * @param stage The stage to take this `LifeModule` for
   * @param lm The `LifeModule` to use
   * @param [field] Optional: a field to be associated with this module
   */
  public addLifeModule (stage: LifeStage, lm: LifeModule, field?: string): void {
    // Can't take the same affiliation twice
    if (this._affiliationTaken(stage, lm)) {
      return;
    }

    this._preAllocateFixedXps(lm);
    this._addCharacterLifeModule(stage, lm, field);
    this._reCacheAffiliations(lm);
  }

  /**
   * A list of a characters affiliations. This method utilizes a cache.
   */
  public affiliations (): CharacterLifeModule[] {
    if (this._affiliations.length === 0) {
      this._affiliations = this._lifeModules.filter(
        lm => lm.stage === LifeStage.AFFILIATION
      );
    }

    return this._affiliations;
  }

  /**
   * Adds the given amount of XP to this character's `Attribute`.
   *
   * @param attr The attribute to add the XP to
   * @param xp The amount of XP that's being added
   */
  public addAttributeXP (attr: Attribute, xp: number, spend = true): void {
    this.attributes.addXP(xp, attr);
    if (spend) {
      this.removeXP(xp);
    }
  }

  /**
   * TODO: Write Me!
   *
   * @param target The skill to have XP added to
   * @param xp The amount of XP the skill should have added to it
   * @param spend If this XP should come from the character's XP pool, defaults to true
   */
  public addSkillXP (target: Skill, xp: number, spend = true): void {
    this.skills = this._addToExperience<Skill>(this.skills, target, xp, spend);
  }

  /**
   * TODO: Write Me!
   *
   * @param target The trait to have XP added to
   * @param xp The amount of XP the trait should have added to it
   * @param spend If this XP should come from the character's XP pool, defaults to true
   */
  public addTraitXP (target: Trait, xp: number, spend = true): void {
    this.traits = this._addToExperience<Trait>(this.traits, target, xp, spend);
  }

  /**
   * Removes the given amount of XP from this character's `Attribute`.
   *
   * @param attr The attribute to add the XP to
   * @param xp The amount of XP that's being added
   */
  public removeAttributeXP (attr: Attribute, xp: number, refund = true): void {
    this.attributes.removeXP(xp, attr);
    if (refund) {
      this.addXP(xp);
    }
  }

  /**
   * TODO: Write Me!
   *
   * @param target The skill to have XP removed from
   * @param xp The amount of XP to remove from the skill
   * @param refund If the XP should go back to the character's XP pool, defaults to true
   */
  public removeSkillXP (target: Skill, xp: number, refund = true): void {
    this.skills = this._removeFromExperience<Skill>(this.skills, target, xp, refund);
  }

  /**
   * TODO: Write Me!
   *
   * @param target The trait to have XP removed from
   * @param xp The amount of XP to remove from the trait
   * @param refund If the XP should go back to the character's XP pool, defaults to true
   */
  public removeTraitXP (target: Trait, xp: number, refund = true): void {
    this.traits = this._removeFromExperience<Trait>(this.traits, target, xp, refund);
  }

  /**
   * Checks if this character has a trait by the provided name.
   *
   * @param name The name of the trait to check for
   */
  public hasTrait (name: string): boolean {
    return !!this.getTrait(name);
  }

  /**
   * Gets the trait of this character by the provided name.
   *
   * @param name The name of the trait to get
   */
  public getTrait (name: string): Trait | undefined {
    return this.traits.find(t => t.name === name);
  }

  /**
   * Returns all of this character's skills in stringified form.
   */
  public skillStrings (): string[] {
    return this.skills.map(toString);
  }

  public selectFixedXP (
    lifeModuleIndex: number,
    fixedXpIndex: number,
    optionIndex: number
  ): void {
    const xpSet = this.lifeModules[lifeModuleIndex].fixedXps[fixedXpIndex];
    const option = xpSet.options[optionIndex];

    // The specified option will only be applied if the Fixed XP still has XP to
    // be allocated.
    if (xpSet.incomplete) {
      this._applyFixedXpOption(option, xpSet, optionIndex);
    }
  }

  /**
   * Returns all of this character's traits in stringified form.
   */
  public traitStrings (): string[] {
    return this.traits.map(toString);
  }

  public xpValue (): number {
    return this.xp;
  }

  private _preAllocateFixedXps (lm: LifeModule): void {
    lm.fixedXps.forEach(set => {
      if (set.requiresChoices) {
        return;
      }

      set.options.forEach((option: Attribute | IExperience, index: number) => {
        this._applyFixedXpOption(option, set, index);
      });
    });
  }

  private _applyFixedXpOption (option: Attribute | IExperience, set: FixedXP, index: number): void {
    if (typeof option === 'string') {
      this.addAttributeXP(option as Attribute, set.xp, false);
    } else {
      if (option instanceof Skill) {
        this.addSkillXP(option, set.xp, false);
      } else if (option instanceof Trait) {
        this.addTraitXP(option, set.xp, false);
      }
    }

    set.take(index);
  }

  private _addCharacterLifeModule (stage: LifeStage, lm: LifeModule, field?: string): void {
    const module = new CharacterLifeModule(stage, lm);
    if (field) {
      module.fields.push(field);
    }

    this._lifeModules.push(module);
  }

  // If the `LifeModule` being added is an affiliation make sure that the
  // _affiliations array gets re-cached.
  private _reCacheAffiliations (lm: LifeModule): void {
    if (lm.stage === LifeStage.AFFILIATION) {
      this._affiliations = [];
      this.affiliations();
    }
  }

  private _addToExperience<T extends IExperience & IEquity> (ts: T[], target: T, xp: number, spend: boolean): T[] {
    const t = ts.find(x => x.equal(target));

    if (spend) {
      this.removeXP(xp);
    }

    if (t) {
      t.addXP(xp, this.learning);

      return ts;
    } else {
      target.addXP(xp, this.learning);

      return [ ...ts, target];
    }
  }

  private _removeFromExperience<T extends IExperience & IEquity> (ts: T[], target: T, xp: number, refund: boolean): T[] {
    const t = ts.find(x => x.equal(target));

    if (refund) {
      this.addXP(xp);
    }

    if (t) {
      t.removeXP(xp, this.learning);

      return (t.xpValue() === 0) ? ts.filter(x => !x.equal(t)) : ts;
    } else {
      target.removeXP(xp, this.learning);

      return [ ...ts, target ];
    }
  }

  // Determines if a given life module has already been taken as an affiliation
  private _affiliationTaken (stage: LifeStage, lm: LifeModule): boolean {
    if (stage === LifeStage.AFFILIATION) {
      return this._lifeModules.filter(
        l => l.stage === stage && l.name === lm.name
      ).length > 0;
    } else {
      return false;
    }
  }
}
