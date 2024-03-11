import WebSocket from "ws";

interface WebSocketClient {
  id: string;
  isAlive: boolean
}

declare module "ws" {
  interface WebSocket extends WebSocketClient {}
  namespace WebSocket {
    type id = string;
  }
}
