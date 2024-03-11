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
import RedisStream from "@/lib/utils/redis/RedisStream";
import RedisPublisher from "@/lib/utils/redis/RedisPublisher";
import RedisStorage from "@/lib/utils/redis/RedisStorage";
import * as console from "console";

const services = [
  { events: CharacterEvents, service: CharacterService },
  { events: GameplayEvents, service: GameplayService },
  { events: LoggerEvents, service: LoggerService },
  { events: InventoryEvents, service: InventoryService },
  { events: RendererEvents, service: RendererService }
];

async function consumeEvent(message: any) {
  const data = JSON.parse(message.message);
  for (const { events, service } of services) {
    if (isValidEvent(data, events)) await service.consume(data);
  }
}

const server = new WebSocketServer({port: 3030});
(global as any)["wsServer"] = server;

async function handleClient(client: WebSocket, request: IncomingMessage) {
  console.log("Client connected!");

  const query = new URLSearchParams(request.url!.split("?")[1]);
  const userId = query.get("userId") ?? "Unknown";
  const clients: Array<WebSocket> = Array.from(server.clients as Set<WebSocket>);
  const existed = clients.find(client => client.id ===  userId)

  client["id"] = userId
  client.isAlive = true
  if (existed) existed.terminate()

  client.on('message', async (message) => {
    await Performer.handleIncomingMessage(message)
  });

  client.on("error", (error) => { console.log("Websocket client error:", error )})
  client.on('close', () => { console.log("Client disconnected!") } )
  client.on("pong", () => { client.isAlive = true })
}

async function initRedis() {
  await Promise.all([
    RedisStream.getInstance(),
    RedisPublisher.getInstance(),
    RedisStorage.getInstance(),
  ])
}

// server entry point
async function main() {
  try {

    // init redis singletons
    await initRedis()

    // start redis streams consumer
    const streamInterval = listenToStream(consumeEvent, ["gameplay"])

    // ping clients periodical
    const interval = setInterval(function ping() {
      const clients: Array<WebSocket> = Array.from(server.clients as Set<WebSocket>);
      clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    // handle ws server
    server.on("connection", handleClient)
    server.on("close", () => { clearInterval(interval); clearInterval(streamInterval) })
    server.on("error", (error) => { console.log("WebSocket server error:", error) });

  } catch (error) { console.log("Internal server error:", error) }
}

main()
