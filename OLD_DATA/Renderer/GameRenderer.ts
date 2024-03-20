import Character from "@/lib/Character/Character";
import InventoryModel from "@/lib/Inventory/InventoryModel";
import {MainScenes} from "@/lib/Game/GameCommands";
import ShopModel from "@/lib/Shop/ShopModel";
import {GameplayData} from "@/lib/Gameplay/types";
import {WebSocket, WebSocketServer} from "ws";

export default class GameRenderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId;
  }

  async render(payload: any) {
    const character = await Character.initialize(this.userId)
    const inventory = await InventoryModel.initialize(this.userId)
    const availableActions = character.state.availableActions
    const availableScenes = character.state.availableScenes
    const inVillage = character.state.status === "IN_VILLAGE"
    const currentScene = payload?.scene ?? (inVillage ? MainScenes.VILLAGE_SCENE : MainScenes.DUNGEON_SCENE)
    const shop = new ShopModel()
    const data = {
      character: {
        currentHealth: character.currentHealth,
        maxHealth: character.maxHealth,
        balance: character.balance,
        endurance: character.endurance,
        maxEndurance: character.maxEndurance
      },
      shop: shop,
      inventory: inventory,
      availableActions: availableActions,
      availableScenes: availableScenes,
      currentScene: currentScene
    }

    this.push(data)
  }

  private push(data: Partial<GameplayData>){
    const webSocket = (global as never)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => parseInt(client.id) == this.userId)

    if (!client || client.readyState != 1) return

    client.send(JSON.stringify(data))
  }
}
