import {GameLocation} from "@/lib/GameLocation";
import {CharacterEvents, GameplayEvent, MapEvents} from "@/lib/utils/enums";
import emitEvent from "@/lib/utils/events";
import {GameMap} from "@/lib/GameMap";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";

export class GameplayState implements WithRedisStorage{
  timeToNextAction!: number
  defaultActionTimeout!: number;
  status!: "idle" | "inBattle" | "onBase" | "inAction"
  userId: number
  currentScene!: string;
  currentLocationId!: number
  storage!: RedisStorage

  constructor(userId: number) {
    this.defaultActionTimeout = 5 // seconds
    this.timeToNextAction = 0
    this.userId = userId
    this.currentScene = "main"
    this.storage = new RedisStorage(`gamestate:${this.userId}`)
  }

  async currentLocation(): Promise<GameLocation> {
    const map = await new GameMap().load()
    const location =  map.locations.find((location) => location.id === this.currentLocationId)
    return location || map.locations[0]
  }

  async load() {
    const data = await this.storage.load()

    this.status = data.status ?? "idle"
    this.currentScene = data.currentScene || "main"
    this.currentLocationId = data.currentLocationId ?? 1

    return this
  }

  async dump () {
    await this.storage.dump(this.toJson())
  }

  toJson(){
    const {
      storage:_,
      ...props} = this

    return props
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

    let nextLocationId = (this.currentLocationId + 1) % (map.locations.length + 1)
    if (nextLocationId == 0) nextLocationId = 1
    this.currentLocationId = nextLocationId
  }
}
