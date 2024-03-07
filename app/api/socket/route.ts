import {IncomingMessage} from "node:http";
import {WebSocket, WebSocketServer} from "ws";
import {publishToStream} from "@/lib/streams/utils";
import GamePerformer from "@/lib/utils/GamePerformer";
import StreamEvent from "@/lib/streams/StreamEvent";
import {NextResponse} from "next/server";
import GameRenderer from "@/lib/utils/GameRenderer";

export async function GET() {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}

export async function SOCKET(client: WebSocket, request: IncomingMessage, server: WebSocketServer,) {
  const query = new URLSearchParams(request.url!.split("?")[1]);
  client["id"] = query.get("userId") ?? "Unknown";
  (global as any)["wsServer"] = server;

  // server.once("connection", async () => {
  //   await publishToStream(
  //     "gameplay",
  //     new StreamEvent().gameInit(parseInt(client.id), {})
  //   )
  // })

  await publishToStream(
    "gameplay",
    new StreamEvent().gameInit(parseInt(client.id), {})
  )

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

    }
  });

  client.on('close', async () => {
    await publishToStream(
      "gameplay",
      new StreamEvent().gameQuited(parseInt(client.id), {})
    )

    console.log("Client disconnected!")
  });
}
