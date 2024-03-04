import {GameLocation} from "@/lib/game/GameLocation";

import locationsData from "../data/locations.json"

export class GameMap {
  locations!: GameLocation[];
  width!: number;
  height!: number;

  constructor() {
    this.width = 5
    this.height = 5
  }

  async load(): Promise<this> {
    await this.loadLocations();

    return this
  }

  async loadLocations() {
    this.locations = []

    locationsData.map(location => {
      this.locations.push(new GameLocation(location.id, location.name, location.desc, "danger"))
    })
  }
}
