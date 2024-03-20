import {IncomingMessage} from "http"
import {gPlayers} from "@/lib/Game/Game";
import Performer from "@/lib/Game/Performer";
import {WebSocket, WebSocketServer} from "ws";

const SERVER_PORT = 3030;
const PING_INTERVAL = 30000;

const server = new WebSocketServer({port: SERVER_PORT});
(global as any)["wsServer"] = server;

async function handleClient(wsClient: WebSocket, request: IncomingMessage) {
  console.log("Client connected!");
  const query = new URLSearchParams(request.url!.split("?")[1]);
  const userId = Number(query.get("userId"))

  const clients: Array<WebSocket> = Array.from(server.clients as Set<WebSocket>);
  const existingClient = clients.find(client => client['id'] === userId)
  wsClient["id"] = userId;
  wsClient['isAlive'] = true;
  if (existingClient) existingClient.terminate();

  wsClient.on('message', async (message) => {
    await Performer.handleIncomingMessage(message)
  });

  wsClient.on("error", (error) => {
    console.log("Websocket client error:", error)
  })
  wsClient.on('close', () => {
    gPlayers.get(userId)?.save();
    gPlayers.delete(userId)
    console.log("Client disconnected!");
  });

  wsClient.on("pong", () => {
    wsClient['isAlive'] = true;
  })
}

export default async function startWsServer() {
  const interval = setInterval(() => {
    const clients: Array<WebSocket> = Array.from(server.clients as Set<WebSocket>);
    clients.forEach((wsClient) => {
      if (!wsClient['isAlive']) return wsClient.terminate();

      wsClient['isAlive'] = false;
      wsClient.ping();
    });
  }, PING_INTERVAL);

  server.on("connection", handleClient);
  server.on("close", () => { clearInterval(interval) });
  server.on("error", (error) => {
    console.log("WebSocket server error:", error)
  });
}

export async function stopWsServer() {
  server.close(() => console.log("Websocket server stopped!"))
}
