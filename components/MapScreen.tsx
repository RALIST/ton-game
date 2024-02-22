import {GameMap} from "@/lib/GameMap";

export default function MapScreen({map}: {map: GameMap}){
  return(
    <div className={"map"}>
      {map.locations.map(location => {
        return <div key={location.id} className={"location"}>
          <div>{location.id} </div>
          <div>{location.name}</div>
        </div>
      })}
    </div>
  )
}
