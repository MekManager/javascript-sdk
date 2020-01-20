Feature: Fixed XP
  Most Life Modules give out specific XPs for having taken them.

Scenario: Simple Attribute XP
  Given a new character
  When the character takes the affiliation: "Fixed BOD XP"
  Then the character should have a "Body" score of 20
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Multiple Attributes get XP
  Given a new character
  When the character takes the affiliation: "No Choice Multiple Attributes"
  Then the character should have a "Body" score of 20
  And the character should have a "Strength" score of 20
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Required input
  Given a new character
  When the character takes the affiliation: "Multiple Choice Attributes"
  Then the character should have a "Body" score of 0
  And the character should have a "Strength" score of 0
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Adding a skill
  Given a new character
  When the character takes the affiliation: "Computers skill"
  Then the character should have 1 "skill"
  And the character should have a "Computers" "skill" with 40 XP
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Adding a trait
  Given a new character
  When the character takes the affiliation: "In For Life"
  Then the character should have 1 "trait"
  And the character should have a "In For Life" "trait" with 100 XP
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Giving input for Fixed XPs
  Given a new character
  When the character takes the affiliation: "Multiple Choice Attributes"
  And the user selects the 2nd option for the 1st Fixed XP of the 1st Life Module
  Then the character should have a "Body" score of 0
  And the character should have a "Strength" score of 20
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Giving input for Fixed XPs with maximum choices
  Given a new character
  When the character takes the affiliation: "Multiple Choice Attributes"
  And the user selects the 2nd option for the 1st Fixed XP of the 1st Life Module
  And the user selects the 1st option for the 1st Fixed XP of the 1st Life Module
  Then the character should have a "Body" score of 0
  And the character should have a "Strength" score of 20
  And the character should be "Valid"
  And no XP should have been spent

Scenario: Skills that prevent automatic allocation
  Given a new character
  When the character takes the affiliation: "Linguist"
  Then the character should have 0 "skills"
  And the character should be "Valid"
  And no XP should have been spent
