import {GameLocation} from "@/lib/GameLocation";

export default function CurrentLocation({location}: {location: GameLocation}) {
  return (
    <div className={"currentLocation"}>
      <div className={"locationHeader"}>{location.name}</div>
      <div className={"locationDesc"}>{location.desc}</div>
    </div>
  )
}
