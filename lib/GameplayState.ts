import {redis} from "@/lib/utils/redis";
import {GameLocation} from "@/lib/GameLocation";
import {CharacterEvents, GameplayEvent, MapEvents} from "@/lib/utils/enums";
import emitEvent from "@/lib/utils/events";
import {GameMap} from "@/lib/GameMap";

export class GameplayState {
  timeToNextAction!: number
  defaultActionTimeout!: number;
  status!: "idle" | "inBattle" | "onBase" | "inAction"
  userId: number
  currentScene!: string;
  currentLocation!: GameLocation

  constructor(userId: number) {
    // default configs
    this.defaultActionTimeout = 5 // seconds
    this.timeToNextAction = 0
    this.userId = userId
    this.currentScene = "main"
  }

  async load() {
    const map = await new GameMap().load()
    const data = JSON.parse(await redis.get(`gamestate:${this.userId}`) || "{}")
    this.status = data?.status || "idle"
    this.currentScene = data.currentScene || "main"
    const locationId = data?.currentLocation?.id
    this.currentLocation = map.locations.find((location) => location.id === locationId) || map.locations[0]

    return this
  }

  getAvailableAction(): string[] {
    switch(this.status) {
      case "idle": {
        return ["move", "look", "back"]
      }
      case "onBase": {
        return ["move"]
      }
      case "inBattle": {
        return ["attack", "run"]
      }
      default: {
        return []
      }
    }
  }

  async handleEvent(event: string, payload: any){
    switch (event) {
      case GameplayEvent.MOVE_STARTED: {
        this.status = "inAction"
        break;
      }
      case CharacterEvents.ENDURANCE_CHANGED: {
        await this.changeLocation()
        await emitEvent(MapEvents.LOCATION_CHANGED, payload, "gameplay")
        break;
      }
      case GameplayEvent.MOVE_COMPLETED: {
        this.status = "idle"
        break;
      }
      default: {
        return
      }
    }
  }

  async changeLocation() {
    const map = await new GameMap().load()

    let nextLocationId = (this.currentLocation.id + 1) % (map.locations.length + 1)
    if (nextLocationId == 0) nextLocationId = 1

    const nextLocation = map.locations.find((location) => location.id === nextLocationId)
    if (nextLocation) {
      this.currentLocation = nextLocation
    }
  }

  async dump () {
    await redis.set(`gamestate:${this.userId}`, JSON.stringify(this))
  }
}
