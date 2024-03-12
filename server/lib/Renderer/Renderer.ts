import LoggerModel from "@/lib/Logger/LoggerModel";
import {WebSocket, WebSocketServer} from "ws";
import InventoryModel from "@/lib/Inventory/InventoryModel";
import {SceneCommands} from "@/lib/utils/GameCommands";
import GameMap from "@/lib/Dungeon/GameMap";
import ShopModel from "@/lib/Shop/ShopModel";
import CharacterModel from "@/lib/Character/CharacterModel";
import {GameplayData} from "@/lib/Gameplay/types";
import CharacterState from "@/lib/Character/state/CharacterState";

// collect game data and push data to ws socket
export default class Renderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId;
  }

  async render(payload: any) {
    // const logger  = await new GameLogger(this.userId).load()
    const character = await CharacterModel.initialize(this.userId)
    const characterState = await new CharacterState(this.userId).load()
    const availableActions = characterState.availableActions
    const availableScenes = characterState.availableScenes
    const currentScene = payload?.scene ?? (characterState.status == "IN_VILLAGE" ? SceneCommands.VILLAGE_SCENE : SceneCommands.DUNGEON_SCENE)
    let data;
    const sceneData: Partial<GameplayData> = { currentScene: currentScene };

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
          availableActions: availableActions,
          availableScenes: availableScenes,
          currentScene: currentScene
        }
        break;
      }

      case SceneCommands.INVENTORY_SCENE: {
        const inventory = await InventoryModel.initialize(this.userId)
        data = { inventory: inventory, ...sceneData }
        break
      }

      case SceneCommands.CHARACTER_SCENE: {
        data = { character: character, ...sceneData }
        break;
      }

      case SceneCommands.SHOP_SCENE: {
        const shop = new ShopModel()
        data = { character: { balance: character.balance }, shop: shop, ...sceneData }
        break;
      }

      case SceneCommands.DUNGEON_SCENE: {
        const logger  = await new LoggerModel(this.userId).load()
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
          availableActions: availableActions,
          availableScenes: availableScenes,
          currentScene: currentScene
        }
        break;
      }
      default: {
        data = {...sceneData}
      }
    }

    this.push(data)
  }

  private push(data: Partial<GameplayData>) {
    const webSocket = (global as never)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => parseInt(client.id) == this.userId)

    if (!client || client.readyState != 1) return

    client.send(JSON.stringify(data))
  }
}
