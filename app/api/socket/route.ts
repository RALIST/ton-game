import {IncomingMessage} from "node:http";
import {WebSocket, WebSocketServer} from "ws";
import {Gameplay} from "@/lib/Gameplay";

export function SOCKET(client: WebSocket, _request: IncomingMessage, _server: WebSocketServer,) {
  console.log("A client connected!")

  client.on('message', async (message) => {
    const data = JSON.parse(message.toString())

    if (data && data.userId) {
      const gameplay = new Gameplay(data.userId)

      switch (data.action) {
        case "init": {
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
    } else {
      client.send(JSON.stringify({error: "Incorrect user id"}))
      client.close()
    }
  });

  client.on('close', async () => {
    console.log('A client disconnected!');
  });
}
