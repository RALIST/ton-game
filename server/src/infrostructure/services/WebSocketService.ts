import {WebSocket, WebSocketServer} from "ws";
import {IncomingMessage} from "http";
import {IService} from "@/src/infrostructure/services/types";
import Performer from "@/src/infrostructure/services/Performer";

export default class WebSocketService implements IService {
  static defaultPort = 3030;
  static defaultClientsPingInterval = 30000;

  port: number;
  clientsPingInterval: number;
  webSocketServer!: WebSocketServer;
  performer: Performer

  constructor(performer: Performer, port?: number, clientsPingInterval?: number) {
    this.performer = performer
    this.port = port || WebSocketService.defaultPort;
    this.clientsPingInterval = clientsPingInterval || WebSocketService.defaultClientsPingInterval;
    this.webSocketServer = new WebSocketServer({port: this.port});
  }

  public async start() {
    (global as any)["wss"] = this.webSocketServer;
    console.log("Websocket service is starting...");

    const interval = this.pingClients()
    this.webSocketServer.on("connection", this.handleClient.bind(this));

    this.webSocketServer.on("close", () => {
      clearInterval(interval)
      this.webSocketServer.clients.forEach(client => client.close())
    });

    this.webSocketServer.on("error", (error) => {
      console.log("WebSocket server error:", error)
    });

    console.log("Websocket service started!");
  }

  public async stop() {
    this.webSocketServer.close((error) => {
      if (error) console.log(error)
    })
  }

  private handleClient(client: WebSocket, request: IncomingMessage): void {
    console.log("Client connected!");

    const query = new URLSearchParams(request.url!.split("?")[1]);
    const userId = Number(query.get("userId"))

    const clients: Array<WebSocket> = Array.from(this.webSocketServer.clients as Set<WebSocket>);
    const existingClient = clients.find(client => client.id === userId)

    client.id = userId;
    client.isAlive = true;
    if (existingClient) existingClient.terminate();

    client.on('message', async (message) => {
      await this.performer.handleIncomingMessage(message)
    });

    client.on('error', (error) => {
      console.log("Websocket client error:", error);
      client.close();
    })

    client.on('close', () => { console.log("Connection closed!") });
    client.on("pong", () => { client.isAlive = true })
  }

  private pingClients(): NodeJS.Timeout {
    return setInterval(() => {
      const clients: Array<WebSocket> = Array.from(this.webSocketServer.clients as Set<WebSocket>);
      clients.forEach((wsClient) => {
        if (!wsClient['isAlive']) return wsClient.terminate();

        wsClient['isAlive'] = false;
        wsClient.ping();
      });
    }, this.clientsPingInterval);
  }
}
