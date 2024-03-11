import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "node:http";
import Performer from "@/lib/Performer/Performer";
import {isValidEvent, listenToStream} from "@/lib/utils/streams/utils";
import {CharacterEvents, GameplayEvents, InventoryEvents, LoggerEvents, RendererEvents} from "@/lib/utils/GameEvents";
import RendererService from "@/lib/Renderer/RendererService";
import LoggerService from "@/lib/Logger/LoggerService";
import CharacterService from "@/lib/Character/CharacterService";
import InventoryService from "@/lib/Inventory/InventoryService";
import GameplayService from "@/lib/Gameplay/GameplayService";

const server = new WebSocketServer({port: 3030})
console.log("WS Server started!")

server.once("connection", () => {
  listenToStream(  async (message) => {
    const data = JSON.parse(message.message);
    if (isValidEvent(data, CharacterEvents)) await CharacterService.consume(data);
    if (isValidEvent(data, GameplayEvents)) await GameplayService.consume(data);
    if (isValidEvent(data, LoggerEvents)) await LoggerService.consume(data);
    if (isValidEvent(data, InventoryEvents)) await InventoryService.consume(data);
    if (isValidEvent(data, RendererEvents)) await RendererService.consume(data);
  }, ["gameplay"])
})

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
