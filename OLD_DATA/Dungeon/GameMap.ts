import {DungeonLocation} from "@/lib/Dungeon/DungeonLocation";

import locationsData from "./data/locations.json"

export default class GameMap {
  locations!: DungeonLocation[];
  width!: number;
  height!: number;

  constructor() {
    this.width = 5
    this.height = 5
  }

  async load() {
    await this.loadLocations();

    return this
  }

  async loadLocations() {
    this.locations = []

    locationsData.map(location => {
      this.locations.push(new DungeonLocation(location.id, location.name, location.desc, "danger"))
    })
  }
}
