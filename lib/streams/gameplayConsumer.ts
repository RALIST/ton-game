import {listenToStream} from "@/lib/streams/utils";
import CharacterService from "@/lib/services/CharacterService";
import GameLoggerService from "@/lib/services/GameLoggerService";
import GameRendererService from "@/lib/services/GameRendererService";
import GameplayService from "@/lib/services/GameplayService";
import InventoryService from "@/lib/services/InventoryService";

let streamInterval: NodeJS.Timeout | undefined;

async function gameConsumer(){
  streamInterval = await listenToStream((message) => {
    CharacterService.handleEvent(message)
    GameplayService.handleEvent(message)
    InventoryService.handleEvent(message)
    GameLoggerService.handleEvent(message)
    GameRendererService.handleEvent(message)
  }, ["gameplay"])
}

export async function stopGameplayService(){
  clearInterval(streamInterval)
  process.exit(0)
}

export async function startGameplayService() {
  console.log("Gameplay service started!")
  await gameConsumer()
}
