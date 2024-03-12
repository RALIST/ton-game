import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "node:http";
import Performer from "@/lib/Performer/Performer";
import {initStreams} from "@/lib/utils/streams/utils";
import * as console from "console";
import {initRedis} from "@/lib/utils/redis/utils";

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

async function startWsServer() {
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
  server.on("close", () => { clearInterval(interval) })
  server.on("error", (error) => { console.log("WebSocket server error:", error) });
}

// server entry point
async function main() {
  try {
    await initRedis()
    await initStreams()
    await startWsServer()
  } catch (error) { console.log("Internal server error:", error) }
}

main()
  .then(() => {console.log("Game Server Started!")})
  .catch(error => {console.error("Internal server error:", error)})
