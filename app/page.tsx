'use client';

import {useContext, useEffect, useState} from "react";
import MainScreen from "@/components/MainScreen";
import {Gameplay} from "@/lib/Gameplay";
import {WsContext} from "@/lib/utils/WsContext";
import {useInitData, useViewport} from "@tma.js/sdk-react";

export default function Home() {
  const [game, setGame] = useState<Gameplay | null>(null)
  const ws = useContext(WsContext)

  const layout = useViewport();
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  useEffect(() => {
    layout.expand()

    if (ws.readyState === 1) {
      ws.send(JSON.stringify({action: "init", userId: userId}))
    }

    ws.addEventListener("message", (event) => {
      const data: Gameplay = JSON.parse(event.data)
      setGame(data)
    })
  }, []);

  if (!game) {
    return <div>Loading...</div>
  } else {
    return <MainScreen character={game.character}
                       availableActions={game.availableActions}
                       state={game.state}
                       log={game.log}/>
  }

};
