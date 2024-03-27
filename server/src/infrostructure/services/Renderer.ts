import {WebSocket, WebSocketServer} from "ws";
import PlayerRenderer from "@/src/application/presenters/PlayerRenderer";
import {VillageScenes} from "@/src/domain/entities/Game/GameCommands";

export default class Renderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId;
  }

  async render(payload: any) {
    if (payload.result) {
      const currenScene = payload.scene || "village_scene"
      const availableScenes = currenScene === "village_scene" ? Object.values(VillageScenes) : []

      const data = {
        currentPlayer: await new PlayerRenderer(this.userId).render(),
        currentScene: currenScene,
        availableScenes: availableScenes,
        availableActions: []
      }

      this.push(data)
    } else {
      this.push(payload)
    }
  }

  private push(data: any){
    const webSocket = (global as never)?.["wss"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => client.id === this.userId)
    if (!client || client.id === 0 || client.readyState != 1) return

    client.send(JSON.stringify(data))
  }
}
