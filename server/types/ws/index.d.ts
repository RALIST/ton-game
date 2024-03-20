import WebSocket from "ws";

interface WebSocketClient {
  id: number;
  isAlive: boolean
}

declare module "ws" {
  interface WebSocket extends WebSocketClient {}
  namespace WebSocket {
    type id = number;
  }
}
