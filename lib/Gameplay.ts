import {Character} from "@/lib/Character";
import MainMenu from "@/components/MainMenu";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {GameMap} from "@/lib/GameMap";
import {GameLocation} from "@/lib/GameLocation";

export type Action = {
  name: string,
  callback: () => void,
}

export class Gameplay {
  character!: Character;
  map!: GameMap;
  userId: number;
  loading!: boolean
  status!: "idle" | "moving" | "moved" | "in_battle" | "looking"
  defaultActionTimeout!: number;
  location!: GameLocation;

  constructor(userId: number) {
    this.userId = userId
    this.loading = true
    this.status = "idle"
    this.defaultActionTimeout = 1000
  }

  async load() {
    this.character = await this.loadCharacter()
    this.map = await new GameMap().load();

    this.location = this.map.locations[0]
    this.loading = false
  }

  async loadCharacter() {
    return await new Character(this.userId).init()
  }

  async move() {
    this.status = "moving"
    console.log("Character moving")

    setTimeout(() => {
      this.status = "moved";
      this.setNextLocation()
      console.log(`Character moved to ${this.location.name}`)
    }, this.defaultActionTimeout)
  }

  async look() {
    this.status = "looking"
    console.log("Character looking")

    setTimeout(() => {
      this.status = "idle";
      console.log("Character looked")
    }, this.defaultActionTimeout)
  }

  async battle() {
    this.status = "in_battle"
    console.log(("Character in battle"))

    setTimeout(() => {
      this.status = "idle";
      console.log("Battle completed")
    }, this.defaultActionTimeout)
  }

  setNextLocation() {
    const nextId = this.location.id + 1
    if (nextId > this.map.locations.length) {
      this.location = this.map.locations[0]
    } else {
      this.location = this.map.locations.find(location => location.id == nextId) || this.map.locations[0]
    }
  }

  getAvailableAction(): Action[] {
    switch(this.status) {
      case "idle": {
        return [
          {
            name: "Идти дальше",
            callback: () => this.move()
          },
          {
            name: "Осмотрется",
            callback: () => this.look()
          }
        ]
      }
      case "moved": {
        return [
          {
            name: "Идти дальше",
            callback: () => this.move()
          },
          {
            name: "Осмотрется",
            callback: () => this.look()
          }
        ]
      }
      case "in_battle": {
        return [
          {
            name: "Атаковать",
            callback: () => this.move()
          },
          {
            name: "Убежать",
            callback: () => this.look()
          }
        ]
      }
      default: {
        return []
      }
    }
  }

  draw() {
    const {balance, health, endurance} = this.character

    return MainMenu({
      balance: balance,
      health: health,
      endurance: endurance,
      location: this.location,
      availableActions: this.getAvailableAction()
    })
  }
}
