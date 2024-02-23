import {Character} from "@/lib/Character";
import MainScreen from "@/components/MainScreen";
import {GameMap} from "@/lib/GameMap";
import {GameplayState} from "@/lib/GameplayState";
import CreateCharacterScreen from "@/components/CreateCharacterScreen";
import {JSXElementConstructor} from "react";

export type Action = {
  name: string,
  callback: () => void,
}

export type LogEntry = {
  message: string,
  type: string
}

export class Gameplay {
  userId: number;
  character!: Character;
  map!: GameMap;
  state!: GameplayState
  currentScene!: JSXElementConstructor<any>
  log!: LogEntry[]

  constructor(userId: number) {
    this.userId = userId
    this.log = []
  }

  logEvent(message: string, type: string) {
    this.log.push({message: message, type: type})
  }

  info(message: string) {
    this.logEvent(message, "info")
  }

  alert(message: string) {
    this.logEvent(message, "alert")
  }

  success(message: string) {
    this.logEvent(message, "success")
  }

  async load() {
    this.character = await new Character(this.userId).load()
    this.map = await new GameMap().load();
    this.state = await new GameplayState().load()

    if (this.character) {
      this.currentScene = MainScreen
      this.state.location = this.state.location || this.map.locations[0]
      this.character.recoverEndurance(); // TODO: move to async backend timer
      this.character.recoverHealth(); // TODO: move to async backend timer
    } else {
      this.currentScene = CreateCharacterScreen
    }

    this.info("Game loaded")
  }

  async move(locationId?: number) {
    locationId ||= (this.state.location?.id || this.map.locations[0].id) + 1

    this.state.status = "moving"
    this.state.timeToNextAction = this.state.defaultActionTimeout
    this.character.endurance = this.character.endurance - 1

    const interval = setInterval(() => {
      this.state.timeToNextAction--

      if (this.state.timeToNextAction == 0) {
        clearInterval(interval);
        this.moved(locationId || 0)
      }
    }, 1000)
  }

  // events on move complete
  moved(locationId: number) {
    this.setNextLocation(locationId)

    if (Math.random() > 0.5) {
      this.alert("Вы наткнулись на банду рейдеров! Приготовьтесь к бою")
      this.state.status = "in_battle"
    } else {
      this.info("Эта локация выглядит мирно")
      this.state.status = "idle";
    }
  }

  async look() {
    this.state.status = "looking"
    this.state.timeToNextAction = this.state.defaultActionTimeout
    this.character.endurance = this.character.endurance - 1

    const interval = setInterval(() => {
      this.state.timeToNextAction--
      if (this.state.timeToNextAction == 0) {
        clearInterval(interval);
        this.success("Вы пошарились по локации и нашли 100 монет")
        this.character.balance = this.character.balance + 100
        this.state.status = "idle"
        this.state.timeToNextAction = 0
      }
    }, 1000)
  }

  async attack() {
    this.state.status = "attacking"
    this.state.timeToNextAction = this.state.defaultActionTimeout

    const interval = setInterval(() => {
      this.state.timeToNextAction--

      if (this.state.timeToNextAction == 0) {
        this.alert("Рейдеры успели дать в ответочку, вы потеряли 10 здоровья!")
        this.success("На трупах вы нашли 100 монет!")
        this.info("Вы победили в схватке! Рейдеры получили по щщам")
        this.character.currentHealth = this.character.currentHealth - 10
        this.character.balance = this.character.balance + 100
        this.state.status = "idle";
        clearInterval(interval);
      }
    }, 1000)
  }

  async run() {
    this.state.status = "running"
    this.state.timeToNextAction = this.state.defaultActionTimeout

    const interval = setInterval(() => {
      this.state.timeToNextAction--

      if (this.state.timeToNextAction == 0) {
        this.alert("Рейдеры успели дать в ответочку, вы потеряли 10 здоровья!")
        this.info("Вы убежали от схватки!")
        this.character.currentHealth = this.character.currentHealth - 10
        this.state.status = "idle";
        clearInterval(interval);
      }
    }, 1000)
  }

  setNextLocation(locationId: number) {

    this.state.location = this.map.locations.find(location => location.id == locationId) || this.map.locations[0]
    this.info("-----------------------------------")
    this.info(`Вы перешли в локацию ${this.state.location.name}`)
  }

  getAvailableAction(): Action[] {
    switch(this.state.status) {
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
            callback: () => this.attack()
          },
          {
            name: "Убежать",
            callback: () => this.run()
          }
        ]
      }
      default: {
        return []
      }
    }
  }

  drawScene() {
    // @ts-ignore
    return this.currentScene({
      character: this.character,
      location: this.state.location,
      availableActions: this.getAvailableAction(),
      state: this.state,
      log: this.log
    })
  }
}
