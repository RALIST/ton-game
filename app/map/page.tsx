'use client';
import {useEffect, useState} from "react";
import {Gameplay} from "@/lib/Gameplay";
import {GameMap} from "@/lib/GameMap";
import MapScreen from "@/components/scenes/MapScreen";

export default function Home() {
  const [map, setMap] = useState<GameMap|null>(null)

  useEffect(() => {
    new GameMap().load().then((map) => setMap(map) )
  }, []);

  if (!map) {
    return <div>Game map is loading...</div>
  }

  return <MapScreen map={map}/>
};
