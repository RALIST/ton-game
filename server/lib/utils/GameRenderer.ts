import GameLogger, {LogEntry} from "@/lib/utils/GameLogger";
import Character, {CharacterData} from "@/lib/game/Character";
import {WebSocket, WebSocketServer} from "ws";
import Inventory, {InventoryData} from "@/lib/game/Inventory";
import {SceneCommands} from "@/lib/utils/GameCommands";
import GameMap from "@/lib/game/GameMap";
import Shop from "@/lib/game/Shop";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: CharacterData
  availableActions: string[],
  currentScene: string,
  currentLocation: any,
  inventory: InventoryData,
  totalLocations: number,
  shop: Shop,
  error: string,
}

// collect game data and push data to ws socket
export default class GameRenderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId;
  }

  async render(payload: any) {
    // const logger  = await new GameLogger(this.userId).load()
    const character = await Character.initialize(this.userId)
    const currentScene = payload?.scene ?? (character.status == "inVillage" ? SceneCommands.VILLAGE_SCENE : SceneCommands.DUNGEON_SCENE)
    let data;
    let sceneData: Partial<GameplayData> = { currentScene: currentScene };

    switch(currentScene) {
      case SceneCommands.VILLAGE_SCENE: {
        data = {
          character: {
            currentHealth: character.currentHealth,
            maxHealth: character.maxHealth,
            balance: character.balance,
            endurance: character.endurance,
            maxEndurance: character.maxEndurance
          },
          availableActions: Object.values(SceneCommands) as string[],
          ...sceneData,
        }
        break;
      }
      case SceneCommands.INVENTORY_SCENE: {
        const inventory = await Inventory.initialize(this.userId)
        data = { inventory: inventory, ...sceneData }
        break
      }

      case SceneCommands.CHARACTER_SCENE: {
        const character = await Character.initialize(this.userId)
        data = { character: character, ...sceneData }
        break;
      }

      case SceneCommands.SHOP_SCENE: {
        const shop = new Shop()
        data = { character: { balance: character.balance }, shop: shop, ...sceneData }
        break;
      }

      case SceneCommands.DUNGEON_SCENE: {
        const logger  = await new GameLogger(this.userId).load()
        const character = await Character.initialize(this.userId)
        const map = await new GameMap().load()
        const currentLocation = await character.getCurrentLocation()

        data =  {
          ...sceneData,
          currentLogs: logger.currentLogs,
          character: {
            currentHealth: character.currentHealth,
            maxHealth: character.maxHealth,
            endurance: character.endurance,
            maxEndurance: character.maxEndurance,
            balance: character.balance
          },
          currentLocation: currentLocation,
          totalLocations: map.locations.length,
          availableActions: character.getAvailableAction,
          currentScene: currentScene
        }
        break;
      }
      default: {
        data = {...sceneData}
      }
    }

    // @ts-ignore
    this.push(data)
  }

  private push(data: Partial<GameplayData>) {
    const webSocket = (global as any)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => parseInt(client.id) == this.userId)

    if (!client || client.readyState != 1) return

    client.send(JSON.stringify(data))

  }
}
