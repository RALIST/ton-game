import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "node:http";
import Performer from "@/lib/Performer/Performer";

const server = new WebSocketServer({port: 3030})
console.log("WS Server started!")



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
