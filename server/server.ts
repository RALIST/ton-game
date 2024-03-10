import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "node:http";
import GamePerformer from "@/lib/utils/GamePerformer";
import GameRenderer from "@/lib/utils/GameRenderer";
import {startGameplayService} from "@/lib/streams/GameplayConsumer";

const server = new WebSocketServer({port: 3030})
console.log("WS Server started!")

startGameplayService() // TODO: start as separate service

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
        const performer = new GamePerformer(data.userId)
        await performer.performAction(data.action, data.payload)
      }

      if (data.scene) {
        const renderer = new GameRenderer(data.userId)
        await renderer.render({scene: data.scene})
      }
    } else {
      const renderer = new GameRenderer(parseInt(userId))
      await renderer.render({scene: data.scene})
    }
  });

  client.on('close', async () => {
    console.log("Client disconnected!")
  });
})
