import {DungeonLocation} from "@/lib/Dungeon/DungeonLocation";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: Character
  availableActions: string[],
  currentScene: string,
  currentLocation: DungeonLocation,
  inventory: Inventory,
  totalLocations: number,
  shop: Shop,
  error: string,
}
