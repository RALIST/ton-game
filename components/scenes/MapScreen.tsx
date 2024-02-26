import {GameMap} from "@/lib/GameMap";
import Link from "next/link";
import {useWebSocket} from "@/components/WebSocketContext";
import {useEffect, useState} from "react";
import {GameLocation} from "@/lib/GameLocation";

export default function MapScreen({currentLocation}: {currentLocation: GameLocation}){
  const ws = useWebSocket()
  const [map, setMap] = useState<GameMap | null>(null);

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
            action: "changeScreen",
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
