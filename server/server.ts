import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "node:http";
import Performer from "@/lib/Performer/Performer";
import Renderer from "@/lib/Renderer/Renderer";
import CharacterConsumer from "@/lib/Character/CharacterConsumer";
import InventoryConsumer from "@/lib/Inventory/InventoryConsumer";
import LoggerConsumer from "@/lib/Logger/LoggerConsumer";
import RendererConsumer from "@/lib/Renderer/RendererConsumer";
import GameplayConsumer from "@/lib/Gameplay/GameplayConsumer";

const server = new WebSocketServer({port: 3030})
console.log("WS Server started!")

CharacterConsumer.start()
InventoryConsumer.start()
LoggerConsumer.start()
RendererConsumer.start()
GameplayConsumer.start()

server.on("connection", (client: WebSocket, request: IncomingMessage) => {
  console.log("Client connected!");

  (global as any)["wsServer"] = server;
  const query = new URLSearchParams(request.url!.split("?")[1]);
  const userId = query.get("userId") ?? "Unknown";
  const clients: Array<WebSocket> = Array.from(server.clients as Set<WebSocket>);
  const existed = clients.find(client => client.id ===  userId)
  client["id"] = userId

  if (existed) {
    server.clients.delete(existed);
    existed.close()
  }

  client.on('message', async (message) => {
    const data = JSON.parse(message.toString())
    if (data && data.userId) {
      if (data.action) {
        const performer = new Performer(data.userId)
        await performer.performAction(data.action, data.payload)
      }

      if (data.scene) {
        const renderer = new Renderer(data.userId)
        await renderer.render({scene: data.scene})
      }
    } else {
      const renderer = new Renderer(parseInt(userId))
      await renderer.render({scene: data.scene})
    }
  });

  client.on('close', async () => {
    console.log("Client disconnected!")
  });
})
