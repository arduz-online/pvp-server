import { BaseAI } from "./AI/Base";

export class AISystem {
  currentTime = 0;
  bots!: ComponentGroup;

  activate(engine: Engine) {
    this.bots = engine.getComponentGroup(BaseAI);
  }

  update(dt: number) {
    this.currentTime += dt;

    for (let entity of this.bots.entities) {
      const ai = entity.getComponentOrNull(BaseAI);
      if (ai) {
        ai.strategy.tick(entity, this.currentTime);
      }
    }
  }
}
