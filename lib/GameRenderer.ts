import {GameLogger, LogEntry} from "@/lib/GameLogger";
import {Character} from "@/lib/Character";
import {GameLocation} from "@/lib/GameLocation";
import {WebSocketServer, WebSocket} from "ws";
import {RendererEvents} from "@/lib/utils/gameEvents";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: Character,
  availableActions: string[],
  currentScene: string,
  currentLocation: GameLocation
  error: string
}

// collect game data and push data to ws socket
export default class GameRenderer {
  userId: number;

  constructor(userId: number) {
    this.userId = userId
  }

  async handleEvent(event: string, _payload: any) {
    switch (event) {
      case RendererEvents.GAME_INIT:
      case RendererEvents.ACTION_COMPLETED: {
        await this.push();
        break;
      }
    }
  }

  async render() {
    const character = await new Character(this.userId).load()
    const logger  = await new GameLogger(this.userId).load()

    return {
      currentLogs: logger.currentLogs,
      character: character ,
      currentLocation: await character.currentLocation(),
      availableActions: character.getAvailableAction(),
      currentScene: "main",
      error: ""
    }
  }

  async push() {
    const webSocket = (global as any)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => parseInt(client.id) == this.userId)

    if (!client || client.readyState != 1) return

    setTimeout(async () => {
      const data = await this.render()
      client.send(JSON.stringify(data))
    }, 100)
  }
}
