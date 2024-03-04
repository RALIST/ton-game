import {GameMap} from "@/lib/game/GameMap";
import {useWebSocket} from "@/components/WebSocketContext";
import {useEffect, useState} from "react";
import {GameLocation} from "@/lib/game/GameLocation";
import {GameCommands} from "@/lib/utils/GameCommands";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import "@/assets/map.css"

export default function MapScreen({currentLocation}: {currentLocation: GameLocation}){
  const ws = useWebSocket()
  const [map, setMap] = useState<GameMap | null>(null);

  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const backButton = useBackButton()
  const callback = () => { ws?.send(JSON.stringify({
    action: GameCommands.CHANGE_SCREEN,
    userId: userId,
    payload: {scene: "main"}
  }))}

  backButton.on("click", callback)

  useEffect(() => {
    backButton.show();
    new GameMap().load().then(m => setMap(m))
  }, [backButton]);

  if (!map) {
    return <div>Loading...</div>
  } else {
    const isCurrent = (id: number): boolean => { return id === currentLocation.id }
    return(
      <div className={"map"}>
        {map.locations.map(location => {
          return <div key={location.id} className={isCurrent(location.id) ? "currentLocation" : "location"}>
            <div>{location.name}</div>
          </div>
        })}
      </div>
    )
  }
}
