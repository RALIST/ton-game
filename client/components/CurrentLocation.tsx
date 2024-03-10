import {DungeonLocation} from "@lib/game/DungeonLocation";

export default function CurrentLocation({location}: {location: DungeonLocation}) {
  return (
    <div className={"currentLocation"}>
      <div className={"locationHeader"}>{location.name}</div>
      <div className={"locationDesc"}>{location.desc}</div>
    </div>
  )
}
