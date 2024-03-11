import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "node:http";
import Performer from "@/lib/Performer/Performer";
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
    await Performer.handleIncomingMessage(message)
  });

  client.on('close', async () => {
    console.log("Client disconnected!")
  });
})
