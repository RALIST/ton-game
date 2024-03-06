import {isValidEvent, listenToStream} from "@/lib/streams/utils";
import CharacterService from "@/lib/services/CharacterService";
import GameLoggerService from "@/lib/services/GameLoggerService";
import GameRendererService from "@/lib/services/GameRendererService";
import GameplayService from "@/lib/services/GameplayService";
import InventoryService from "@/lib/services/InventoryService";
import StreamEvent from "@/lib/streams/StreamEvent";
import {CharacterEvents, GameplayEvents, InventoryEvents, LoggerEvents, RendererEvents} from "@/lib/utils/GameEvents";

let streamInterval: NodeJS.Timeout | undefined;

async function gameConsumer() {
  streamInterval = await listenToStream((message) => {
    const data: StreamEvent = JSON.parse(message.message);

    if (isValidEvent(data, CharacterEvents)) CharacterService.consume(data);
    if (isValidEvent(data, GameplayEvents)) GameplayService.consume(data);
    if (isValidEvent(data, InventoryEvents)) InventoryService.consume(data);
    if (isValidEvent(data, LoggerEvents)) GameLoggerService.consume(data);
    if (isValidEvent(data, RendererEvents)) GameRendererService.consume(data);
  }, ["gameplay"])
}

export async function stopGameplayService() {
  clearInterval(streamInterval);
  process.exit(0);
}

export async function startGameplayService() {
  console.log("Gameplay service started!");
  await gameConsumer();
}
