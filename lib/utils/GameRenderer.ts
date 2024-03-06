import GameLogger, {LogEntry} from "@/lib/utils/GameLogger";
import Character, {CharacterData} from "@/lib/game/Character";
import {WebSocketServer, WebSocket} from "ws";
import Inventory, {InventoryData} from "@/lib/game/Inventory";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: CharacterData
  availableActions: string[],
  currentScene: string,
  currentLocation: any,
  inventory: InventoryData,
  error: string,
}

// collect game data and push data to ws socket
export default class GameRenderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId;
  }

  async render(payload: any) {
    const character = await Character.initialize(this.userId)
    const logger  = await new GameLogger(this.userId).load()
    const inventory = await Inventory.initialize(this.userId)
    const currentScene = payload?.scene ?? "main"

    const data: GameplayData =  {
      currentLogs: logger.currentLogs,
      character: character,
      currentLocation: {},
      availableActions: character.getAvailableAction(),
      currentScene: currentScene,
      inventory: inventory,
      error: ""
    }

    this.push(data)
  }

  private push(data: GameplayData) {
    const webSocket = (global as any)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => parseInt(client.id) == this.userId)

    if (!client || client.readyState != 1) return

    setTimeout(() => {
      client.send(JSON.stringify(data))
    }, 100)
  }
}
