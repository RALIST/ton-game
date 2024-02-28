"use client"

import {createContext, ReactNode, useContext, useEffect, useMemo} from "react";

export const WebSocketContext = createContext<WebSocket| null>(null)

export function WebSocketProvider({url, children}: {
  children: ReactNode;
  url: string
}) {
  const isBrowser = typeof window !== 'undefined';
  const instance = useMemo(() => {
    if (!isBrowser) {
      return null;
    }

    return new WebSocket(url);
  }, [isBrowser, url])

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
