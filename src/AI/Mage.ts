import { CharacterDescription } from "sdk/Declares";
import { Character } from "sdk/Components/Character";
import { getRandomInteger, distance } from "sdk/AtomicHelpers/Numbers";
import { items, skills } from "sdk/Balance";
import { getNakedBody, getHead } from "sdk/Components/Body";
import { isInvisible } from "sdk/Components/Invisible";
import { AiStrategy, TargetEntity } from "./Base";
import { entitiesWithBodyAndPosition, WorldPosition } from "sdk/Components/WorldPosition";
import { charUsesItem } from "sdk/Events/CharEvents";
import { isParalyzed } from "sdk/Components/Paralysis";
import { handleUseSkill, handleMapClick, handleWalk } from "sdk/Functions/networkHandlers";
import { Walking } from "sdk/Components/Walking";
import { Alignment } from "../Alignments";
import { SkillSlots, Race, Gender, CharClass, InventorySlots } from "sdk/Enums";

const REMOVE_PARALYSIS_SLOT = SkillSlots.Spell3;
const DESC_SLOT = SkillSlots.Spell7;
const APOKA_SLOT = SkillSlots.Spell8;
const INMO_SLOT = SkillSlots.Spell2;

export class MageAi extends AiStrategy {
  nextTick = 0;

  rollDice(faces: number): boolean {
    faces = faces | 0;
    return getRandomInteger(0, faces) == faces;
  }

  get archetype(): CharacterDescription {
    const race = Race.Human;
    const gender = Gender.Male;

    return {
      id: "mg",
      charClass: CharClass.Mage,
      race: Race.Human,
      gender: Gender.Male,
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
      skills: [
        {
          slot: SkillSlots.Spell1,
          skill: skills.get(5)!, // GRAVES
        },
        {
          slot: INMO_SLOT,
          skill: skills.get(24)!, // PARALIZAR
        },
        {
          slot: REMOVE_PARALYSIS_SLOT,
          skill: skills.get(10)!, // REMO
        },
        {
          slot: SkillSlots.Spell4,
          skill: skills.get(11)!, // RESU
        },
        {
          slot: SkillSlots.Spell5,
          skill: skills.get(14)!, // INVI
        },
        {
          slot: SkillSlots.Spell6,
          skill: skills.get(15)!, // TORMENTA
        },
        {
          slot: DESC_SLOT,
          skill: skills.get(23)!, // DESC
        },
        {
          slot: APOKA_SLOT,
          skill: skills.get(25)!, // APOK
        },
      ],
      nick: "Mage BOT",
      body: getNakedBody(gender, race),
      head: getHead(gender, race),
    };
  }

  statsTick(char: IEntity) {
    if (char instanceof Character) {
      if (!char.timers.canUseItem()) {
        return;
      }

      const chancesOfDrinkingPosion = isParalyzed(char) ? 2 : 5;

      if (this.rollDice(chancesOfDrinkingPosion)) {
        if (char.stats.minHp < char.stats.maxHp) {
          // restore HP is the priority
          charUsesItem(char, InventorySlots.Belt1);
        } else if (char.stats.minMana < char.stats.maxMana) {
          // restore MANA when possible
          charUsesItem(char, InventorySlots.Belt2);
        }
      }
    }
  }

  acquireTarget(entity: IEntity) {
    let bestTarget: Entity | null = null;
    let bestTargetDistance: number = 9999999;

    const entityAlignment = entity.getComponentOrNull(Alignment);
    const entityPosition = entity.getComponent(WorldPosition);

    if (!entityAlignment) return;

    for (let char of entitiesWithBodyAndPosition()) {
      if (char instanceof Character) {
        if (char == entity) continue;
        if (char.body.dead) continue;
        const alignment = char.getComponentOrNull(Alignment);

        if (!alignment || alignment == entityAlignment) {
          continue;
        }

        if (isInvisible(char)) continue;

        const position = char.getComponent(WorldPosition);

        const dist = distance(entityPosition.x, entityPosition.y, position.x, position.y);

        // pick closest character
        if (!bestTarget || bestTargetDistance > dist) {
          bestTarget = char;
          bestTargetDistance = dist;
          if (dist <= 3) break;
        }
      }
    }

    if (bestTarget) {
      entity.getComponentOrCreate(TargetEntity).entity = bestTarget;
    }
  }

  tick(me: IEntity, now: number) {
    if (!(me instanceof Character)) return;
    if (this.nextTick > now) return;
    this.nextTick = now + 0.05 + 0.13 * Math.random();

    if (me.body.dead) {
      if (this.rollDice(12)) {
        handleWalk(me, getRandomInteger(0, 3));
      }
      return;
    }

    this.statsTick(me);

    const skills = me.skills;
    const timers = me.timers;

    if (!skills) return;

    let target = me.getComponentOrNull(TargetEntity);

    if (target && target.entity) {
      if (isInvisible(target.entity) || (target.entity instanceof Character && target.entity.body.dead)) {
        target.entity = null;
      }
    }

    if (!target || !target.entity || this.rollDice(1)) {
      this.acquireTarget(me);
    }

    target = me.getComponentOrNull(TargetEntity);

    const targetChar = target && target.entity instanceof Character && target.entity;

    if (isParalyzed(me)) {
      // cast remove paralysis spell
      if (timers.canSpell()) {
        if (this.rollDice(6)) {
          handleUseSkill(me, REMOVE_PARALYSIS_SLOT);
          handleMapClick(me, me.position.x, me.position.y);
        }
      }

      return;
    } else if (targetChar && !targetChar.body.dead) {
      const attackDistance = 100;

      if (timers.canSpell()) {
        const isTargetParalyzed = isParalyzed(targetChar);
        const baseRandom = 2;
        const dist = distance(me.position.x, me.position.y, targetChar.position.x, targetChar.position.y);
        const distDiv = dist / attackDistance;
        const multiplier = isTargetParalyzed ? 0 : (3 * distDiv) | 0;

        if (dist > attackDistance) {
          // do nothing, we are far away
        } else if (!this.rollDice(multiplier)) {
          // do nothing, we missed
          timers.didSpell();
        } else {
          this.attack(me, targetChar, baseRandom * multiplier + 2);
          timers.didSpell();
        }
      }
    }

    if (timers.canWalk()) {
      if (targetChar) {
        me.getComponentOrCreate(Walking).target = targetChar.position;
      } else {
        if (this.rollDice(5)) {
          handleWalk(me, getRandomInteger(0, 3));
        }
      }
    }
  }

  private attack(me: Character, targetChar: Character, baseChances: number) {
    const skills = me.skills!;

    if (
      !isParalyzed(targetChar) &&
      this.rollDice(baseChances) &&
      (targetChar.body.charClass === CharClass.Warrior ||
        targetChar.body.charClass === CharClass.Hunter ||
        this.rollDice(baseChances)) &&
      skills.enoughManaFor(INMO_SLOT, me.stats)
    ) {
      handleUseSkill(me, INMO_SLOT);
      handleMapClick(me, targetChar.position.x, targetChar.position.y);
    } else if (skills.enoughManaFor(APOKA_SLOT, me.stats)) {
      handleUseSkill(me, APOKA_SLOT);
      handleMapClick(me, targetChar.position.x, targetChar.position.y);
    } else if (skills.enoughManaFor(DESC_SLOT, me.stats)) {
      handleUseSkill(me, DESC_SLOT);
      handleMapClick(me, targetChar.position.x, targetChar.position.y);
    }
  }
}
