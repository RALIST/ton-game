'use client';

import {useContext, useEffect, useState} from "react";
import MainScreen from "@/components/MainScreen";
import {Gameplay} from "@/lib/Gameplay";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useWebSocket} from "@/components/WebSocketContext";

export default function Home() {
  const [game, setGame] = useState<Gameplay | null>(null)
  const ws = useWebSocket()

  const layout = useViewport();
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  useEffect(() => {
    layout.expand()
    // @ts-ignore
    ws.onopen = () => {
      ws?.send(JSON.stringify({action: "init", userId: userId}))
    }

    // @ts-ignore
    ws.onmessage = function (event) {
      const data: Gameplay = JSON.parse(event.data)
      setGame(data)
    }
  }, [layout, userId, ws]);

  if (!game) {
    return <div>Loading...</div>
  } else {
    return <MainScreen character={game.character}
                       availableActions={game.availableActions}
                       state={game.state}
                       log={game.log}/>
  }

};
