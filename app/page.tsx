'use client';
import {useEffect, useState} from "react";
import {Character} from "@/lib/Character";
import {Gameplay} from "@/lib/Gameplay";
import {useDispatch} from "react-redux";

export default function Home() {
  const [game, setGame] = useState<Gameplay>()
  const dispatch = useDispatch();
  // const initData = useInitData();

  // const userId = initData?.user?.id // get telegram id
  const userId = 1
  useEffect(() => {
    if (!userId) return

    const character = new Character(userId, dispatch).init()
    const gameplay = new Gameplay(character)

    setGame(gameplay)
  }, []);

  return game?.draw()
};
