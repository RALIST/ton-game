'use client';

import {WebSocketProvider} from "@/components/WebSocketContext";
import GameplayScene from "@/components/GameplayScene";
import {useInitData} from "@tma.js/sdk-react";

export default function Home() {
  // const layout = useViewport();
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const isBrowser = typeof window !== 'undefined';
  let url;
  if (isBrowser) {
    url = `wss://${window?.location.hostname}/api/socket?userId=${userId}`
  } else {
    url = "ws://localhost:3000/api/socket?userId=${userId}"
  }

  return (
    <WebSocketProvider url={url}>
      <GameplayScene/>
    </WebSocketProvider>
  )
};
