'use client';

import {WebSocketProvider} from "@/components/WebSocketContext";
import GameplayScene from "@/components/GameplayScene";
import {useInitData, useMiniApp, useViewport} from "@tma.js/sdk-react";
import {useEffect} from "react";

export default function Home() {
  // const layout = useViewport();
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const isBrowser = typeof window !== 'undefined';
  const app = useMiniApp()
  const viewport = useViewport()

  useEffect(() => {
    viewport.expand();
    app.ready();
  });

  let url;
  if (isBrowser) {
    url = `wss://${window?.location.hostname}/api/socket?userId=${userId}`
  } else {
    url = "ws://localhost:3000/api/socket?userId=${userId}"
  }

  return (
    <WebSocketProvider url={url}>
      <div className={"screen"}>
        <GameplayScene/>
      </div>
    </WebSocketProvider>
  )
};
