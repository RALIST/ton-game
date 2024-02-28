import {GameLogger, LogEntry} from "@/lib/GameLogger";
import {Character} from "@/lib/Character";
import {GameLocation} from "@/lib/GameLocation";
import {WebSocketServer, WebSocket} from "ws";
import {GameplayEvents} from "@/lib/utils/enums";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: Character,
  availableActions: string[],
  currentScene: string,
  currentLocation: GameLocation
  error: string
}

// collect game data and push data to ws socket
export default class SceneRenderer {
  userId: number;

  constructor(userId: number) {
    this.userId = userId
  }

  async handleEvent(event: string, _payload: any) {
    switch (event) {
      case GameplayEvents.GAME_INIT:
      case GameplayEvents.GLOBAL_CHARACTER_ATTRIBUTES_CHANGED:
      case GameplayEvents.REST_COMPLETED:
      case GameplayEvents.ATTACK_COMPLETED:
      case GameplayEvents.LOOK_COMPLETED:
      case GameplayEvents.MOVE_COMPLETED: {
        await this.push();
        break;
      }
    }
  }

  async render(): Promise<GameplayData> {
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

    const data = await this.render()
    client.send(JSON.stringify(data))
  }
}
