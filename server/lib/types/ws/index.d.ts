import WebSocket from "ws";

interface WebSocketClient {
  id: string;
}

declare module "ws" {
  interface WebSocket extends WebSocketClient {}
  namespace WebSocket {
    type id = string;
  }
}
