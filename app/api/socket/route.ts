import {IncomingMessage} from "node:http";
import {WebSocket, WebSocketServer} from "ws";
import {publishToStream} from "@/lib/streams/utils";
import GamePerformer from "@/lib/GamePerformer";
import StreamEvent from "@/lib/streams/StreamEvent";

export async function SOCKET(client: WebSocket, request: IncomingMessage, server: WebSocketServer,) {
  const query = new URLSearchParams(request.url!.split("?")[1]);
  client["id"] = query.get("userId") ?? "Unknown";
  (global as any)["wsServer"] = server;

  await publishToStream(
    "gameplay",
    new StreamEvent().gameInit(parseInt(client.id), {})
  )

  client.on('message', async (message) => {
    const data = JSON.parse(message.toString())
    if (data && data.userId) {
      const performer = new GamePerformer(data.userId)
      await performer.performAction(data.action, data.payload)
    }
  });

  client.on('close', async () => {
    await publishToStream(
      "gameplay",
      new StreamEvent().gameQuited(parseInt(client.id), {})
    )
  });
}
