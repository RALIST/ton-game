import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "http";
import Performer from "@/lib/Game/Performer";
import {IService} from "@/src/infrostructure/services/types";

export default class WebSocketService implements IService{
  port!: number;
  clientsPingInterval!: number
  server!: WebSocketServer

  constructor(port?: number, clientsPingInterval?: number) {
    this.port = port || 3030
    this.clientsPingInterval = clientsPingInterval || 30000
    this.server = new WebSocketServer({port: this.port});
  }

  public async start() {
    (global as any)["wss"] = this.server;
    console.log("Websocket service is starting...");

    const interval = this.pingClients()
    this.server.on("connection", this.handleClient);
    this.server.on("close", () => { clearInterval(interval) });
    this.server.on("error", (error) => { console.log("WebSocket server error:", error) });

    console.log("Websocket service started!");
  }

  public async stop() {
    this.server.close(() => { console.log("WebSocket server closed!")})
  }

  private handleClient(client: WebSocket, request: IncomingMessage) {
    console.log("Client connected!");

    const query = new URLSearchParams(request.url!.split("?")[1]);
    const userId = Number(query.get("userId"))

    const clients: Array<WebSocket> = Array.from(this.server.clients as Set<WebSocket>);
    const existingClient = clients.find(client => client.id === userId)

    client.id = userId;
    client.isAlive = true;
    if (existingClient) existingClient.terminate();

    client.on('message', async (message) => {
      await Performer.handleIncomingMessage(message)
    });

    client.on('error', (error) => {
      console.log("Websocket client error:", error);
      client.close();
    })

    client.on('close', () => {console.log("Connection closed!")});
    client.on("pong", () => {client.isAlive = true;})
  }

  private pingClients() {
    return setInterval(() => {
      const clients: Array<WebSocket> = Array.from(this.server.clients as Set<WebSocket>);
      clients.forEach((wsClient) => {
        if (!wsClient['isAlive']) return wsClient.terminate();

        wsClient['isAlive'] = false;
        wsClient.ping();
      });
    }, this.clientsPingInterval);
  }
}
