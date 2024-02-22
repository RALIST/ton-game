'use client';
import {useEffect, useState} from "react";
import {Gameplay} from "@/lib/Gameplay";
import {useViewport} from "@tma.js/sdk-react";

export default function Home() {
  const [game, setGame] = useState<Gameplay>()
  const [, setTime] = useState(Date.now())
  const layout = useViewport();

  // const initData = useInitData();
  // const userId = initData?.user?.id // get telegram id

  const userId = 1
  useEffect(() => {
    layout.expand();

    const interval = setInterval(() => setTime(Date.now), 1000 / 60) // 60 FPS
    const gameplay = new Gameplay(userId);
    gameplay.load().then(() => setGame(gameplay));

    return () => {
      clearInterval(interval)
    }
  }, []);

  return game?.drawScene()
};
