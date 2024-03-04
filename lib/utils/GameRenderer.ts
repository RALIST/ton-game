import {GameLogger, LogEntry} from "@/lib/utils/GameLogger";
import {Character, CharacterAttribute} from "@/lib/game/Character";
import {GameLocation} from "@/lib/game/GameLocation";
import {WebSocketServer, WebSocket} from "ws";
import {RendererEvents} from "@/lib/utils/GameEvents";
import Inventory from "@/lib/game/Inventory";
import Item from "@/lib/game/Item";
import Perk from "@/lib/game/character/Perk";
import Skill from "@/lib/game/character/Skill";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: {
    userId: number,
    balance: number,
    currenLocationId: number,
    enduranceRecoverySpeed: number,
    healthRecoverySpeed: number,
    name: string,
    currentHealth: number,
    maxHealth: number,
    endurance: number,
    maxEndurance: number,
    perks: Perk[],
    skills: {
      skill: Skill,
      exp: number,
      level: number
    }[],
    attributes: CharacterAttribute[]
  },
  availableActions: string[],
  currentScene: string,
  currentLocation: GameLocation,
  inventory: {
    items: Item[]
  },
  error: string,
}

// collect game data and push data to ws socket
export default class GameRenderer {
  userId: number;

  constructor(userId: number) {
    this.userId = userId
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case RendererEvents.GAME_INIT:
      case RendererEvents.CHANGE_SCREEN_STARTED:
      case RendererEvents.CHARACTER_ACTION_COMPLETED: {
        await this.push(payload);
        break;
      }
    }
  }

  async render(payload: any) {
    const character = await new Character(this.userId).load()
    const logger  = await new GameLogger(this.userId).load()
    const inventory = await new Inventory(this.userId).load()
    const currentScene = payload?.scene ?? "main"

    return {
      currentLogs: logger.currentLogs,
      character: {
        ...character,
        attributes: await character.getAttributes(),
        skills: await character.getSkills(),
        perks: await character.getPerks()
      },
      currentLocation: await character.currentLocation(),
      availableActions: character.getAvailableAction(),
      currentScene: currentScene,
      inventory: { items: inventory.getItems() },
      error: ""
    }
  }

  async push(payload: any) {
    const webSocket = (global as any)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => parseInt(client.id) == this.userId)

    if (!client || client.readyState != 1) return

    setTimeout(async () => {
      const data = await this.render(payload)
      client.send(JSON.stringify(data))
    }, 1000 / 60)
  }
}
