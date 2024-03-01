import {listenToStream} from "@/lib/streams/utils";
import CharacterService from "@/lib/services/CharacterService";
import GameLoggerService from "@/lib/services/GameLoggerService";
import GameRendererService from "@/lib/services/GameRendererService";
import EventGeneratorService from "@/lib/services/EventGeneratorService";

async function gameConsumer(){
  await listenToStream((message) => {
    CharacterService.handleEvent(message)
    EventGeneratorService.handleEvent(message)
    GameLoggerService.handleEvent(message)
    GameRendererService.handleEvent(message)
  }, ["gameplay"])
}

export async function startGameplayService() {
  console.log("Gameplay service started!")
  await gameConsumer()
}

await startGameplayService();
