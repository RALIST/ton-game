import GameMap from "@/lib/game/GameMap";
import {useEffect, useState} from "react";
import {DungeonLocation} from "@/lib/game/DungeonLocation";
import {useBackButton} from "@tma.js/sdk-react";
import "@/assets/map.css"

export default function Map({currentLocation}: {currentLocation: DungeonLocation}){
  const [map, setMap] = useState<GameMap | null>(null);
  const backButton = useBackButton()

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
