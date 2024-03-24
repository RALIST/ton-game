import {ReactNode, useEffect, useMemo} from "react";
import { WebSocketContext } from "@/shared";

export function WebSocketProvider({url, children}: { children: ReactNode; url: string }) {
  const isBrowser = typeof window !== 'undefined';
  const instance = useMemo(() => {
    if (!isBrowser) return null

    return new WebSocket(url);
  }, [isBrowser, url])

  useEffect(() => {
    if (instance?.readyState !== WebSocket.OPEN) {
      return
    }

    return () => instance.close()
  }, [instance]);

  // @ts-ignore
  return <WebSocketContext.Provider value={instance}>{children}</WebSocketContext.Provider>
}
