'use client';
import {useEffect, useState} from "react";
import {Gameplay} from "@/lib/Gameplay";

export default function Home() {
  const [game, setGame] = useState<Gameplay>()
  const [time, setTime] = useState(Date.now())

  // const initData = useInitData();
  // const userId = initData?.user?.id // get telegram id

  const userId = 1
  useEffect(() => {
    if (!userId) return

    const interval = setInterval(() => setTime(Date.now), 1000 / 60)
    const gameplay = new Gameplay(userId);
    gameplay.load().then(() => setGame(gameplay));

    return () => {
      clearInterval(interval)
    }
  }, []);

  return game?.draw()
};
