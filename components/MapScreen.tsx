import {GameMap} from "@/lib/GameMap";
import Link from "next/link";

export default function MapScreen({map}: {map: GameMap}){
  return(
    <div className={"map"}>
      <div><Link href={"/"}> Back </Link></div>
      {map.locations.map(location => {
        return <div key={location.id} className={"location"}>
          <div>{location.id} </div>
          <div>{location.name}</div>
        </div>
      })}
    </div>
  )
}
