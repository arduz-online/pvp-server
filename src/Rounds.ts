import { Character } from "sdk/Components/Character";
import type { BasicAlignment } from "@arduz/Connections";
import { MapData } from "sdk/Components/MapData";
import { WorldPosition } from "sdk/Components/WorldPosition";
import { BaseAI } from "./AI/Base";
import { MageAi } from "./AI/Mage";
import { Alignment, RED_TEAM, BLUE_TEAM } from "./Alignments";
import { AutomaticEquip } from "sdk/Components/AutomaticEquip";
import { ConsoleMessages } from "sdk/Enums";

export class TeamRoundsSystem implements ISystem {
  private timeCounter = 0;

  private alignedEntities!: ComponentGroup;

  constructor() {}

  activate(engine: Engine) {
    this.alignedEntities = engine.getComponentGroup(Alignment);
  }

  update(dt: number): void {
    this.timeCounter += dt;
    if (this.timeCounter < 4) return;
    this.timeCounter = 0;

    if (this.alignedEntities.entities.length) {
      this.checkRound();
    }
  }

  *users() {
    for (let char of this.alignedEntities.entities) {
      if (char instanceof Character && char.connection) {
        yield { char, alignment: char.getComponent(Alignment) };
      }
    }
  }

  *bots() {
    for (let char of this.alignedEntities.entities) {
      if (char instanceof Character && !char.connection) {
        yield { char, alignment: char.getComponent(Alignment) };
      }
    }
  }

  usersAlive(alignment: BasicAlignment): number {
    let i = 0;
    for (let user of this.users()) {
      if (user.alignment === alignment && !user.char.body.dead) i++;
    }
    return i;
  }

  usersTotal(alignment: BasicAlignment): number {
    let i = 0;
    for (let user of this.users()) {
      if (user.alignment === alignment) i++;
    }
    return i;
  }

  aliveNpcs(alignment: BasicAlignment): number {
    let i = 0;
    for (let bot of this.bots()) {
      if (bot.alignment === alignment && !bot.char.body.dead) i++;
    }
    return i;
  }

  botsTotal(alignment: BasicAlignment): number {
    let i = 0;
    for (let user of this.bots()) {
      if (user.alignment === alignment) i++;
    }
    return i;
  }

  checkRound() {
    let someTeamIsDead: null | string = null;

    const aliveRed = this.usersAlive(RED_TEAM);
    const aliveBlue = this.usersAlive(BLUE_TEAM);

    const totalRed = this.usersTotal(RED_TEAM);
    const totalBlue = this.usersTotal(BLUE_TEAM);

    if ((totalRed && !aliveRed) || (!aliveRed && !this.aliveNpcs(RED_TEAM))) {
      someTeamIsDead = RED_TEAM.id;
    }

    if ((totalBlue && !aliveBlue) || (!aliveBlue && !this.aliveNpcs(BLUE_TEAM))) {
      someTeamIsDead = BLUE_TEAM.id;
    }

    if (!someTeamIsDead) return;

    for (let { char } of this.users()) {
      char.sendConsoleMessage("The " + someTeamIsDead + " team looses this round!");
      char.sendConsoleMessage(ConsoleMessages["Restarting round"]);
      this.goToBase(char);
      char.resucitate(true);
      char.getComponentOrCreate(AutomaticEquip);
    }

    this.balanceBots();

    for (let { char } of this.bots()) {
      this.goToBase(char);
      char.resucitate(true);
      char.getComponentOrCreate(AutomaticEquip);
    }
  }

  balanceBots() {
    const TEAM_SIZE = 2;

    const blueUsers = this.usersTotal(BLUE_TEAM);
    const redUsers = this.usersTotal(RED_TEAM);

    let expectedRedBots = 0;
    let expectedBlueBots = 0;

    expectedRedBots = Math.max(0, TEAM_SIZE - redUsers);
    expectedBlueBots = Math.max(0, TEAM_SIZE - blueUsers);

    let didChange = false;

    let blueBots = this.botsTotal(BLUE_TEAM);
    let redBots = this.botsTotal(RED_TEAM);

    while (blueBots > expectedBlueBots) {
      this.removeAlignedBot(BLUE_TEAM);
      didChange = true;
      blueBots--;
    }

    while (redBots > expectedRedBots) {
      this.removeAlignedBot(RED_TEAM);
      didChange = true;
      redBots--;
    }

    while (blueBots < expectedBlueBots) {
      this.addBot(BLUE_TEAM);
      didChange = true;
      blueBots++;
    }

    while (redBots < expectedRedBots) {
      this.addBot(RED_TEAM);
      didChange = true;
      redBots++;
    }

    return didChange;
  }

  addBot(alignment: BasicAlignment) {
    const mage = new Character();
    mage.position.x = 2;
    mage.position.y = 3;
    mage.addComponentOrReplace(alignment);
    mage.addComponent(new BaseAI(new MageAi())).strategy.start(mage);
    mage.body.nick = "bot";
    mage.body.color = alignment.color;
    engine.addEntity(mage);
  }

  removeAlignedBot(alignment: BasicAlignment) {
    for (let bot of this.bots()) {
      if (bot.alignment === alignment) {
        engine.removeEntity(bot.char);
        return;
      }
    }
  }

  goToBase(entity: Entity) {
    const alignment = entity.getComponentOrNull(Alignment);
    const worldPosition = entity.getComponentOrCreate(WorldPosition);

    const map = engine.rootEntity.getComponent(MapData);

    const position = alignment == RED_TEAM ? map.findReverseWalkableTile().next() : map.findWalkableTile().next();

    if (position.value) {
      worldPosition.x = position.value.x;
      worldPosition.y = position.value.y;
    }
  }
}
