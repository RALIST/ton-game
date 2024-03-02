import {GameMap} from "@/lib/GameMap";
import Link from "next/link";
import {useWebSocket} from "@/components/WebSocketContext";
import {useEffect, useState} from "react";
import {GameLocation} from "@/lib/GameLocation";
import {GameCommands} from "@/lib/utils/gameCommands";
import {useInitData} from "@tma.js/sdk-react";

export default function MapScreen({currentLocation}: {currentLocation: GameLocation}){
  const ws = useWebSocket()
  const [map, setMap] = useState<GameMap | null>(null);
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  useEffect(() => {
      new GameMap().load().then(m => setMap(m))
  }, []);

  if (!map) {
    return <div>Loading...</div>
  } else {
    const isCurrent = (id: number): boolean => { return id === currentLocation.id }
    return(
      <div className={"screen"}>
        <div className={"map"}>
          <div><Link href={"/"} onClick={() => ws?.send(JSON.stringify({
            action: GameCommands.CHANGE_SCREEN,
            userId: userId,
            payload: {scene: "main"}
          }))}> Back </Link></div>
          {map.locations.map(location => {
            return <div key={location.id} className={isCurrent(location.id) ? "currentLocation" : "location"}>
              <div>{location.id} </div>
              <div>{location.name}</div>
            </div>
          })}
        </div>
      </div>
    )
  }
}
