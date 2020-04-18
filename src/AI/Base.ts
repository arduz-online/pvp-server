import { CharacterDescription } from "sdk/Declares";
import { Archetypes } from "sdk/Components/Archetype";
import { loadCharacterFromArchetype } from "sdk/Functions/Helpers";

export abstract class AiStrategy {
  abstract tick(entity: IEntity, now: number): void;
  abstract get archetype(): CharacterDescription;

  start(entity: IEntity) {
    const archetype = this.archetype;
    entity.getComponentOrCreate(Archetypes).setArchetype(archetype);
    loadCharacterFromArchetype(entity, archetype.id);
  }
}

@Component("ai")
export class BaseAI {
  constructor(public readonly strategy: AiStrategy) {}
}

@Component("targetEntity")
export class TargetEntity {
  entity: Entity | null = null;
}
