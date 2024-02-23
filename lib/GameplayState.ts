import {GameLocation} from "@/lib/GameLocation";

import locationsData from "./data/locations.json"
import initialState from "./data/initialState.json"

export class GameplayState {
  timeToNextAction!: number
  defaultActionTimeout!: number;
  status!: "idle" | "moving" | "moved" | "in_battle" | "looking" | "attacking"| "running" | string
  location!: GameLocation | null;

  constructor() {
    // default configs
    this.defaultActionTimeout = 5 // seconds
    this.timeToNextAction = 0
  }

  // loads game state from storage or event log
  async load(): Promise<this> {
    this.status = initialState.status
    const loadedLocation = locationsData[1]
    this.location = new GameLocation(loadedLocation.id, loadedLocation.name, loadedLocation.desc)

    return this
  }

  // save state to storage
  dump () {

  }
}
