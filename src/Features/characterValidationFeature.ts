import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import {
  Attribute,
  Character,
  ClanCaste,
  LifeModule,
  LifeStage,
  Trait,
} from '../MekWarrior4';
import { CharacterValidationService } from '../MekWarrior4/validators';
import { mockAffiliations } from './TestData/affiliations';
import { mockLifeModules } from './TestData/lifeModules';
import { mockTraits } from './TestData/traits';

const world: {
  character?: Character
  initialXP: number
} = {
  initialXP: 0,
};


Given('a new character', () => {
  world.character = new Character();
  world.initialXP = world.character.xpValue();
});


When('the character takes the affiliation: {string}', (affil: string) => {
  const affiliation: LifeModule = mockAffiliations[affil]();
  expect(affiliation).not.to.be.undefined;

  world.character.addAffiliation(affiliation);
});

When(
  /^the character takes the module \"(.*)\" for stage (\d+)\s?(?:focusing on the \"(.*)\" field)?/,
  (modStr: string, stage: number, field?: string) => {
    const mod: LifeModule = mockLifeModules[modStr];
    expect(mod).not.to.be.undefined;

    if (field !== undefined) {
      world.character.addLifeModule(stage, mod, field);
    } else {
      world.character.addLifeModule(stage, mod);
    }
  }
);

When('the character takes the caste: {string}', (caste: string) => {
  // The enum values are strings at the end of the day, and we can just assume
  // the tests are passing the correct values.
  world.character.caste = caste as ClanCaste;
});

When(
  /^the character takes the trait: \"(.*)\"(?: during stage (\d+))?(?: with (-?\d+) XP)?/,
  (traitStr: string, stage?: number, xp?: number) => {
    const trait: Trait = mockTraits[traitStr];
    expect(trait).not.to.be.undefined;

    if (stage !== undefined) {
      trait.stageTaken = stage as LifeStage;
    }

    if (xp !== undefined) {
      trait.setXP(xp);
    }

    world.character.addTrait(trait);
  }
);

When(
  /^the user selects the (\d+)\w{2} option for the (\d+)\w{2} Fixed XP of the (\d+)\w{2} Life Module$/,
  (optionIndex: number, fixedXpIndex: number, lifeModuleIndex: number) => {
    world.character.selectFixedXP(
      (lifeModuleIndex - 1),
      (fixedXpIndex - 1),
      (optionIndex - 1)
    );
  }
);

When('the character adds {int} XP to their {string} attribute', (xp: number, attr: string) => {
  world.character.addAttributeXP(attr as Attribute, xp);
});

Then('the character should have a {string} score of {int}', (attr: Attribute, score: number) => {
  expect(world.character.attributes.getValues(attr).xp).to.equal(score);
});

Then('no XP should have been spent', () => {
  expect(world.initialXP).to.equal(world.character.xpValue());
});

Then('the character should have {int} affiliation', (count: number) => {
  expect(world.character.lifeModules.length).to.equal(count);
});

Then('the character should be {string}', (validStr: string) => {
  const valid = validStr === 'Valid';
  const service = new CharacterValidationService(world.character);

  expect(service.validate()).to.equal(
    valid,
    service.errors.map(e => e.message).join('\n')
  );
});

Then('the character should have {int} {string}', (expectedCount: number, target: string) => {
  const count = (target === 'skill' || target === 'skills')
    ? world.character.skills.length
    : world.character.traits.length;

  expect(count).to.equal(expectedCount);
});

Then('the character should have a {string} {string} with {int} XP', (name: string, target: string, xp: number) => {
  const experience = (target === 'skill')
    ? world.character.skills.find(s => s.name === name)
    : world.character.traits.find(t => t.name === name);

  expect(experience.xpValue()).to.equal(xp);
});
