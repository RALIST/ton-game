import {IncomingMessage} from "node:http";
import {WebSocket, WebSocketServer} from "ws";
import {Gameplay} from "@/lib/Gameplay";

const gameplay = new Gameplay()

export function GET(_req: Request, _res: Response) {}
export function SOCKET(client: WebSocket, _request: IncomingMessage, _server: WebSocketServer,) {
  console.log("A client connected!")

  client.on('message', async (message) => {
    const data = JSON.parse(message.toString())
    switch (data.action) {
      case "init": {
        await gameplay.load(data.userId)
        client.send(JSON.stringify({...gameplay, availableActions: gameplay.getAvailableAction()}))
        break;
      }
      default: {
        gameplay.performAction(data.action).then(_ => {
          client.send(JSON.stringify({...gameplay, availableActions: gameplay.getAvailableAction()}))
        });
        break;
      }
    }
  });

  client.on('close', async () => {
    console.log('A client disconnected!');
    await gameplay.dump().then(() => { gameplay.unload() })
  });
}
