import {Character} from "@/lib/Character";
import MainScreen from "@/components/MainScreen";
import {GameMap} from "@/lib/GameMap";
import {GameplayState} from "@/lib/GameplayState";
import {JSXElementConstructor} from "react";

import { kv } from "@vercel/kv"

export type LogEntry = {
  message: string,
  type: string
}

export class Gameplay {
  userId!: number;
  character!: Character;
  map!: GameMap;
  state!: GameplayState
  currentScene!: JSXElementConstructor<any>
  log!: LogEntry[]
  availableActions!: string[]
  constructor() {
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

  async load(userId: number) {
    this.userId = userId
    const data = await kv.get<
      {
        userId: number,
        character: Character,
        state: GameplayState,
        log: LogEntry[]
      }
    >(`user:${this.userId}`)
    this.map = await new GameMap().load();

    if (!data) { // new user
      this.character =  await new Character(this.userId).load()
      this.state = await new GameplayState().load()
      this.log = []
      this.currentScene = MainScreen
    } else {
      this.character =  data.character
      this.state = data.state
      this.log = data.log
      this.currentScene = MainScreen
    }

    return this
  }

  async unload() {
    // await this.redis.disconnect()
  }

  async dump(){
    await kv.set(`user:${this.userId}`, JSON.stringify(this))
  }

  async performAction(action: string) {
    switch (action) {
      case "move": { await this.move(); await this.dump(); break; }
      case "attack": { await this.attack(); await this.dump(); break; }
      case "run": { await this.run(); await this.dump(); break; }
      case "look": { await this.look(); await this.dump(); break; }
      default: { await this.move(); await this.dump(); }
    }
  }

  async move(locationId?: number) {
    locationId ||= (this.state.location?.id || this.map.locations[0].id) + 1

    this.state.status = "loading"
    this.character.endurance = this.character.endurance - 1
    this.moved(locationId || 0)
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
    this.state.status = "loading"
    this.character.endurance = this.character.endurance - 1
    this.success("Вы пошарились по локации и нашли 100 монет")
    this.character.balance = this.character.balance + 100
    this.state.status = "idle"
  }

  async attack() {
    this.state.status = "loading"
    this.alert("Рейдеры успели дать в ответочку, вы потеряли 10 здоровья!")
    this.success("На трупах вы нашли 100 монет!")
    this.info("Вы победили в схватке! Рейдеры получили по щщам")
    this.character.currentHealth = this.character.currentHealth - 10
    this.character.balance = this.character.balance + 100
    this.state.status = "idle";
  }

  async run() {
    this.state.status = "loading"
    this.alert("Рейдеры успели дать в ответочку, вы потеряли 10 здоровья!")
    this.info("Вы убежали от схватки!")
    this.character.currentHealth = this.character.currentHealth - 10
    this.state.status = "idle";
  }

  setNextLocation(locationId: number) {
    this.state.location = this.map.locations.find(location => location.id == locationId) || this.map.locations[0]
    this.info("-----------------------------------")
    this.info(`Вы перешли в локацию ${this.state.location.name}`)
  }

  getAvailableAction(): string[] {
    switch(this.state.status) {
      case "idle": {
        return ["move", "look", "back"]
      }
      case "in_battle": {
        return ["attack", "run"]
      }
      default: {
        return []
      }
    }
  }
}
