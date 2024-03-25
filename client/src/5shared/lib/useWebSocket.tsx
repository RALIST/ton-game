import {useContext} from "react";
import {WebSocketContext} from "@shared/lib/WebSocketContext";


export function useWebSocket(): WebSocket | null {
  const context = useContext(WebSocketContext);
  if (context === undefined)
    throw new Error('useWebSocket must be used within a WebSocketProvider');

  return context;
}
