import {IncomingMessage} from "node:http";
import {WebSocket, WebSocketServer} from "ws";
import {Gameplay} from "@/lib/Gameplay";
import {startGameplayService} from "@/lib/services/gameplayService";

let CLIENTS = new Map()

startGameplayService()

export function SOCKET(client: WebSocket, request: IncomingMessage, server: WebSocketServer,) {
  console.log("A client connected!")
  const gameplay = new Gameplay()

  client.on('message', async (message) => {
    console.log(message.toString())
    const data = JSON.parse(message.toString())
    switch (data.action) {
      case "init": {
        await gameplay.load(data.userId)
        const gdata = await gameplay.toJson()
        client.send(JSON.stringify(gdata))
        break;
      }
      default: {
        await gameplay.performAction(data.action, data.payload)
        const gdata = await gameplay.toJson()
        client.send(JSON.stringify(gdata))

        break;
      }
    }
  });

  client.on('close', async () => {
    console.log('A client disconnected!');
  });
}
