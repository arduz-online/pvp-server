import { onNewCharacterObservable, Character } from "sdk/Components/Character";
import { setArchetypes } from "./setupChar";
import {
  sendMessageObservable,
  onMessageObservable,
  onDisconnection,
} from "sdk/Components/Connection";
import { loadCharacterFromArchetype } from "sdk/Functions/Helpers";
import { TeamRoundsSystem } from "./Rounds";
import { AISystem } from "./AI";
import { RED_TEAM, BLUE_TEAM } from "./Alignments";

export async function startTeamsMode() {
  onNewCharacterObservable.add((char) => {
    setupChar(char);

    sendMessageObservable.notifyObservers({
      connectionIds: [char.connection!.connectionId],
      data: {
        ConsoleMessage: {
          message: "Welcome to the TEAM mode game server, please chose a team",
          color: 0x00ff00,
        },
        SelectCharacter: {},
      },
    });
  });

  onDisconnection.add(({ entity }) => {
    engine.removeEntity(entity);
  });

  onMessageObservable.add(({ entity, data }) => {
    if (data.RequestCharacterList) {
      sendMessageObservable.notifyObservers({
        connectionIds: [data.RequestCharacterList.connectionId],
        data: { SelectCharacter: {} },
      });
    }

    if (data.SelectCharacter) {
      if (entity instanceof Character) {
        loadCharacterFromArchetype(entity, data.SelectCharacter.id);
        if (data.SelectCharacter.alignment == RED_TEAM.id) {
          entity.addComponentOrReplace(RED_TEAM);
          entity.body.color = RED_TEAM.color;
        } else if (data.SelectCharacter.alignment == BLUE_TEAM.id) {
          entity.addComponentOrReplace(BLUE_TEAM);
          entity.body.color = BLUE_TEAM.color;
        }
      }
    }
  });

  engine.addSystem(new TeamRoundsSystem());
  engine.addSystem(new AISystem());
}

function setupChar(char: Character) {
  // load base archetypes
  setArchetypes(char, [RED_TEAM, BLUE_TEAM]);
}
