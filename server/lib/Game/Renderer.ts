import {WebSocket, WebSocketServer} from "ws";
import PlayerRenderer from "@/lib/Game/PlayerRenderer";

export default class Renderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId;
  }

  async render(payload: any) {
    const data = {
      currentPlayer: await new PlayerRenderer(this.userId).render(),
      currentScene: payload.scene || "village_scene",
      availableScenes: ['bar_scene', 'shop_scene', 'player_scene'],
      availableActions: []
    }

    this.push(data)
  }

  private push(data: any){
    const webSocket = (global as never)?.["wsServer"] as WebSocketServer;
    if (!webSocket) return

    const clients: Array<WebSocket> = Array.from(webSocket.clients as Set<WebSocket>);
    const client = clients.find(client => client.id === this.userId)
    if (!client || client.id === 0 || client.readyState != 1) return

    client.send(JSON.stringify(data))
  }
}
