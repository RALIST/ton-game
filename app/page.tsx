'use client';

import {WebSocketProvider} from "@/components/WebSocketContext";
import GameplayScene from "@/components/GameplayScene";

export default function Home() {


  // const layout = useViewport();
  // const initData = useInitData();
  // const userId = initData?.user?.id // get telegram id
  const userId = 1
  return (
    <WebSocketProvider url={`ws://localhost:3000/api/socket?userId=${userId}`}>
      <GameplayScene/>
    </WebSocketProvider>
  )
};
