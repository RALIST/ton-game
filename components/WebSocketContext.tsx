"use client"

import {createContext, ReactNode, useContext, useEffect, useMemo} from "react";

export const WebSocketContext = createContext<WebSocket| null>(null)

export function WebSocketProvider({children}: {
  children: ReactNode;
}) {
  const isBrowser = typeof window !== 'undefined';
  const instance = useMemo(() => {
    if (!isBrowser) {
      console.log("WS not in browser");
      return null;
    }

    const url = `ws://${window?.location?.hostname}:3000/api/socket`
    return new WebSocket(url);
  }, [isBrowser])

  useEffect(() => {
    if (instance?.readyState !== WebSocket.OPEN) {
      return
    }

    return () => instance.close()
  }, [instance]);

  return <WebSocketContext.Provider value={instance}>{children}</WebSocketContext.Provider>
}

export function useWebSocket(): WebSocket | null {
  const context = useContext(WebSocketContext);
  if (context === undefined)
    throw new Error('useWebSocket must be used within a WebSocketProvider');

  return context;
}
