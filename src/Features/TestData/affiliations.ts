import { Attribute, FixedXP, LifeModule, LifeStage, Skill, SkillBase, Trait, TraitBase } from '../../MekWarrior4';
import { mockRules } from './rules';

const addFixedXps = (base: LifeModule, xps: FixedXP[]) => {
  base.fixedXps = xps;

  return base;
};

const basicLifeModule = () => {
  return new LifeModule(
    LifeStage.AFFILIATION,
    'standard place',
    [],
    []
  );
};

const defaultAffiliation = basicLifeModule();

const cantBeOnly = new LifeModule(
  LifeStage.AFFILIATION,
  'lonely place',
  [ mockRules.cannotBeOnlyAffiliation ],
  []
);

const legalChildLabor = new LifeModule(
  LifeStage.AFFILIATION,
  'Not a very fun place',
  [ mockRules.legalChildLabor, mockRules.noHigherEducation ],
  []
);

const clan = new LifeModule(
  LifeStage.AFFILIATION,
  'A Clan',
  [],
  [],
  true
);

const sphereClanHybrid = new LifeModule(
  LifeStage.AFFILIATION,
  'Hybrid Clan/Sphere',
  [ mockRules.actsAsClan ],
  [],
  false // Being explicit here because it's the point
);

const noFarm = new LifeModule(
  LifeStage.AFFILIATION,
  'NO FARMS!',
  [ mockRules.noFarm, mockRules.noGreenThumb ],
  []
);

const royalSnob = new LifeModule(
  LifeStage.AFFILIATION,
  'Royal Snob',
  [
    mockRules.forcedToFarmUnlessRoyal,
    mockRules.rankRestrictedByTrait,
    mockRules.noMekTraitingWithoutTitle,
  ],
  []
);

const minimumAttrPlace = new LifeModule(
  LifeStage.AFFILIATION,
  'Top Performers Club',
  [ mockRules.traitRequiresAttributeScore ],
  []
);

const minimumAttrAffiliationPlace = new LifeModule(
  LifeStage.AFFILIATION,
  'Early Life Top Performers Club',
  [ mockRules.traitRequiresAttributeScoreForStage ],
  []
);

const eliteFarmer = new LifeModule(
  LifeStage.AFFILIATION,
  'Elite Farmer',
  [ mockRules.linkedTraits, mockRules.apprenticeShipOnly ],
  []
);

const deepPeriphery = new LifeModule(
  LifeStage.AFFILIATION,
  'Deep Periphery',
  [ mockRules.noMekOrBattleArmor ],
  []
);

const goodVision = new LifeModule(
  LifeStage.AFFILIATION,
  '',
  [ mockRules.needsDecentVision ],
  []
);

const bigBoyClan = new LifeModule(
  LifeStage.AFFILIATION,
  'Clan BigBoy',
  [ mockRules.mustUseOtherPhenotype ],
  [],
  true
);

const topTierClan = new LifeModule(
  LifeStage.AFFILIATION,
  'Clan TopTier',
  [ mockRules.clanWarriorMustTakeTrait ],
  [],
  true
);

// TODO: Figure out what this was for. Some Clan testing it looks like
const topTierAssociate = new LifeModule(
  LifeStage.AFFILIATION,
  'TopTier Associate',
  [ mockRules.clanWarriorMustTakeTrait, mockRules.actsAsClan ],
  []
);

const fixedXpBod = addFixedXps(
  basicLifeModule(),
  [
    new FixedXP(
      1,
      [Attribute.BOD],
      20
    ),
  ]
);

const noChoiceMultiAttrs = addFixedXps(
  basicLifeModule(),
  [
    new FixedXP(
      2,
      [Attribute.BOD, Attribute.STR],
      20
    ),
  ]
);

const computersSkill = addFixedXps(
  basicLifeModule(),
  [
    new FixedXP(
      1,
      [new Skill(
        new SkillBase({
          name: 'Computers',
          targetNumbers: [8, 9],
          complexityRatings: ['CB', 'CA'],
          tiered: true,
          linkedAttributes: [Attribute.INT, [Attribute.DEX, Attribute.INT]],
        })
      )],
      40
    ),
  ]
);

const inForLife = addFixedXps(
  basicLifeModule(),
  [
    new FixedXP(
      1,
      [new Trait(
        new TraitBase({
          name: 'In For Life',
          multipleAllowed: false,
          min: 1,
        })
      )],
      100
    ),
  ]
);

export const mockAffiliations = {
  "Can't Be Only": () => cantBeOnly,
  'Big Boy Clan': () => bigBoyClan,
  'Child Labor': () => legalChildLabor,
  'Clan': () => clan,
  'Deep Periphery': () => deepPeriphery,
  'Default': () => defaultAffiliation,
  'Elite Farmer': () => eliteFarmer,
  'Minimum Attr for Affiliation': () => minimumAttrAffiliationPlace,
  'Minimum Attrs': () => minimumAttrPlace,
  'No Farm': () => noFarm,
  'Royal Snob': () => royalSnob,
  'Sphere/Clan Hybrid': () => sphereClanHybrid,
  'Top Tier Clan': () => topTierClan,
  'Good Vision': () => goodVision,
  'Fixed BOD XP': () => fixedXpBod,
  // This needs to be invoked as a function otherwise it isn't unique between
  // scenarios in the features.
  'Multiple Choice Attributes': () => addFixedXps(
    basicLifeModule(),
    [
      new FixedXP(
        1,
        [Attribute.BOD, Attribute.STR],
        20
      ),
    ]
  ),
  'No Choice Multiple Attributes': () => noChoiceMultiAttrs,
  'Computers skill': () => computersSkill,
  'In For Life': () => inForLife,
  'Linguist': () => addFixedXps(
    basicLifeModule(),
    [
      new FixedXP(
        1,
        [
          (() => {
            const skill = new Skill(
              new SkillBase({
                name: 'Language',
                targetNumbers: [8, 9],
                complexityRatings: ['CB', 'CA'],
                tiered: true,
                linkedAttributes: [Attribute.INT, [Attribute.DEX, Attribute.INT]],
              })
            );
            skill.subName = 'Any';

            return skill;
          })(),
        ],
        100
      ),
    ]
  ),
};
