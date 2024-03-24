import {createContext, useContext} from "react";

export const WebSocketContext = createContext<WebSocket| null>(null)

export function useWebSocket(): WebSocket | null {
  const context = useContext(WebSocketContext);
  if (context === undefined)
    throw new Error('useWebSocket must be used within a WebSocketProvider');

  return context;
}
