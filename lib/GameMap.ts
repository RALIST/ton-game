import {GameLocation} from "@/lib/GameLocation";

import locationsData from "./data/locations.json"

export class GameMap {
  locations!: GameLocation[];

  async load(): Promise<this> {
    await this.loadLocations();

    return this
  }

  async loadLocations() {
    this.locations = []

    locationsData.map(location => {
      this.locations.push(new GameLocation(location.id, location.name, location.desc))
    })
  }
}
