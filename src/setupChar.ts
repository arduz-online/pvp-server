import type { BasicAlignment } from "@arduz/Connections";

import { Character } from "sdk/Components/Character";
import { skills, items } from "sdk/Balance";
import { Archetypes } from "sdk/Components/Archetype";
import { SkillSlots, CharClass, Race, Gender, InventorySlots } from "sdk/Enums";
import { getHead } from "sdk/AtomicHelpers/BodyHelpers";

export function setArchetypes(char: Character, alignments: BasicAlignment[]) {
  const arch = char.getComponentOrCreate(Archetypes);
  const nick = char.body.nick;

  arch.alignments = alignments;

  const hechizos = [
    {
      slot: SkillSlots.Spell1,
      skill: skills.get(1)!,
    },
    {
      slot: SkillSlots.Spell2,
      skill: skills.get(2)!,
    },
    {
      slot: SkillSlots.Spell3,
      skill: skills.get(3)!,
    },
    {
      slot: SkillSlots.Spell4,
      skill: skills.get(41)!,
    },
    {
      slot: SkillSlots.Spell5,
      skill: skills.get(31)!,
    },
    {
      slot: SkillSlots.Spell6,
      skill: skills.get(14)!,
    },
    {
      slot: SkillSlots.Spell7,
      skill: skills.get(15)!,
    },
    {
      slot: SkillSlots.Spell8,
      skill: skills.get(23)!,
    },
    {
      slot: SkillSlots.Spell9,
      skill: skills.get(25)!,
    },
    {
      slot: SkillSlots.Spell10,
      skill: skills.get(24)!,
    },
    {
      slot: SkillSlots.Spell11,
      skill: skills.get(10)!,
    },
  ];

  arch.setArchetype({
    id: "mg",
    charClass: CharClass.Mage,
    race: Race.Human,
    gender: Gender.Male,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 273,
    maxHp: 273,

    minMana: 2206,
    maxMana: 2206,

    inventory: [
      { amount: 999999, item: items.get(38)!, slot: InventorySlots.Slot1 },
      { amount: 999999, item: items.get(37)!, slot: InventorySlots.Slot2 },

      { amount: 100, item: items.get(474)!, slot: InventorySlots.Slot3 },
      { amount: 100, item: items.get(986)!, slot: InventorySlots.Slot4 },
      { amount: 100, item: items.get(660)!, slot: InventorySlots.Slot5 },
      { amount: 100, item: items.get(662)!, slot: InventorySlots.Slot6 },

      { amount: 999999, item: items.get(38)!, slot: InventorySlots.Belt1 },
      { amount: 999999, item: items.get(37)!, slot: InventorySlots.Belt2 },
    ],
    skills: hechizos,
  });

  arch.setArchetype({
    id: "dru",
    charClass: CharClass.Druid,
    race: Race.Elf,
    gender: Gender.Male,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 312,
    maxHp: 312,

    minMana: 1610,
    maxMana: 1610,

    inventory: [
      { amount: 100, item: items.get(474)!, slot: 1 },
      { amount: 100, item: items.get(986)!, slot: 2 },
      { amount: 100, item: items.get(365)!, slot: 3 },
      { amount: 100, item: items.get(208)!, slot: 4 },
      { amount: 999999, item: items.get(38)!, slot: 6 },
      { amount: 999999, item: items.get(37)!, slot: 7 },
    ],
    skills: hechizos,
  });

  arch.setArchetype({
    id: "bard",
    charClass: CharClass.Bard,
    race: Race.Elf,
    gender: Gender.Female,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 312,
    maxHp: 312,

    minMana: 1610,
    maxMana: 1610,

    inventory: [
      { amount: 100, item: items.get(474)!, slot: 1 },
      { amount: 100, item: items.get(986)!, slot: 2 },
      { amount: 100, item: items.get(132)!, slot: 3 },
      { amount: 100, item: items.get(404)!, slot: 4 },
      { amount: 100, item: items.get(696)!, slot: 5 },
      { amount: 999999, item: items.get(38)!, slot: 6 },
      { amount: 999999, item: items.get(37)!, slot: 7 },
      { amount: 100, item: items.get(399)!, slot: 11 },
      { amount: 100, item: items.get(365)!, slot: 12 },
    ],
    skills: hechizos,
  });

  arch.setArchetype({
    id: "cleric",
    charClass: CharClass.Cleric,
    race: Race.Drow,
    gender: Gender.Female,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 312,
    maxHp: 312,

    minMana: 1610,
    maxMana: 1610,

    inventory: [
      { amount: 100, item: items.get(474)!, slot: 1 },
      { amount: 100, item: items.get(359)!, slot: 2 },
      { amount: 100, item: items.get(128)!, slot: 3 },
      { amount: 100, item: items.get(131)!, slot: 4 },
      { amount: 100, item: items.get(696)!, slot: 5 },
      { amount: 999999, item: items.get(38)!, slot: 6 },
      { amount: 999999, item: items.get(37)!, slot: 7 },
      { amount: 100, item: items.get(129)!, slot: 11 },
      { amount: 100, item: items.get(365)!, slot: 12 },
    ],
    skills: hechizos,
  });

  arch.setArchetype({
    id: "pala",
    charClass: CharClass.Paladin,
    race: Race.Human,
    gender: Gender.Female,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 390,
    maxHp: 390,

    minMana: 702,
    maxMana: 702,

    inventory: [
      { amount: 100, item: items.get(474)!, slot: 1 },
      { amount: 100, item: items.get(195)!, slot: 2 },
      { amount: 100, item: items.get(128)!, slot: 3 },
      { amount: 100, item: items.get(131)!, slot: 4 },
      { amount: 100, item: items.get(696)!, slot: 5 },
      { amount: 999999, item: items.get(38)!, slot: 6 },
      { amount: 999999, item: items.get(37)!, slot: 7 },
      { amount: 100, item: items.get(129)!, slot: 11 },
      { amount: 100, item: items.get(365)!, slot: 12 },
    ],
    skills: hechizos,
  });

  arch.setArchetype({
    id: "ase",
    charClass: CharClass.Assasin,
    race: Race.Drow,
    gender: Gender.Male,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 312,
    maxHp: 312,

    minMana: 830,
    maxMana: 830,

    inventory: [
      { amount: 100, item: items.get(474)!, slot: 1 },
      { amount: 100, item: items.get(356)!, slot: 2 },
      { amount: 100, item: items.get(404)!, slot: 3 },
      { amount: 100, item: items.get(131)!, slot: 4 },
      { amount: 100, item: items.get(696)!, slot: 5 },
      { amount: 999999, item: items.get(38)!, slot: 6 },
      { amount: 999999, item: items.get(37)!, slot: 7 },
      { amount: 100, item: items.get(399)!, slot: 11 },
      { amount: 100, item: items.get(367)!, slot: 12 },
    ],
    skills: hechizos,
  });

  arch.setArchetype({
    id: "guerre",
    charClass: CharClass.Warrior,
    race: Race.Dwarf,
    gender: Gender.Male,
    head: getHead(Gender.Male, Race.Human),
    body: 1,
    nick,
    minHp: 429,
    maxHp: 429,

    minMana: 0,
    maxMana: 0,

    inventory: [
      { amount: 100, item: items.get(474)!, slot: 1 },
      { amount: 100, item: items.get(243)!, slot: 2 },
      { amount: 100, item: items.get(128)!, slot: 3 },
      { amount: 100, item: items.get(131)!, slot: 4 },
      { amount: 100, item: items.get(696)!, slot: 5 },
      { amount: 100, item: items.get(38)!, slot: 6 },
      { amount: 100, item: items.get(479)!, slot: 7 },
      { amount: 100, item: items.get(480)!, slot: 8 },
      { amount: 100, item: items.get(129)!, slot: 11 },
      { amount: 100, item: items.get(164)!, slot: 12 },
    ],
    skills: [],
  });

  arch.dirty = true;
}
