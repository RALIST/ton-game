import {Character} from "@/lib/Character";
import MainScreen from "@/components/MainScreen";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {GameMap} from "@/lib/GameMap";
import {GameLocation} from "@/lib/GameLocation";
import {GameplayState} from "@/lib/GameplayState";
import CreateCharacterScreen from "@/components/CreateCharacterScreen";
import {JsonConvertible} from "@prisma/client/runtime/binary";
import React, {JSXElementConstructor} from "react";

export type Action = {
  name: string,
  callback: () => void,
}

export class Gameplay {
  userId: number;
  character!: Character;
  map!: GameMap;
  state!: GameplayState
  currentScene!: JSXElementConstructor<any>

  constructor(userId: number) {
    this.userId = userId
  }

  async load() {
    this.character = await new Character(this.userId).load()
    this.map = await new GameMap().load();
    this.state = await new GameplayState().load()

    if (this.character) {
      this.currentScene = MainScreen
      this.state.location = this.state.location || this.map.locations[0]
      this.character.recoverEndurance(); // TODO: move to async backend timer
    } else {
      this.currentScene = CreateCharacterScreen
    }
  }

  async move(locationId?: number) {
    if (!locationId) {
      locationId = (this.state.location?.id || this.map.locations[0].id) + 1
    }

    this.state.status = "moving"
    this.state.timeToNextAction = this.state.defaultActionTimeout
    this.character.endurance = this.character.endurance - 1

    const interval = setInterval(() => {
      this.state.timeToNextAction--

      if (this.state.timeToNextAction == 0) {
        clearInterval(interval);
        this.state.status = "idle";
        this.setNextLocation(locationId)
      }
    }, 1000)
  }

  async look() {
    this.state.status = "looking"
    this.state.timeToNextAction = this.state.defaultActionTimeout
    this.character.endurance = this.character.endurance - 1

    const interval = setInterval(() => {
      this.state.timeToNextAction--
      if (this.state.timeToNextAction == 0) {
        clearInterval(interval);
        this.state.status = "idle"
        this.state.timeToNextAction = 0
      }
    }, 1000)
  }

  async battle() {
    this.state.status = "in_battle"

    setTimeout(() => {
      this.state.status = "idle";
    }, this.state.defaultActionTimeout)
  }

  setNextLocation(locationId: number | undefined) {
    if(!locationId) {
      return
    }

    this.state.location = this.map.locations.find(location => location.id == locationId) || this.map.locations[0]
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

  drawScene() {
    // @ts-ignore
    return this.currentScene({
      character: this.character,
      location: this.state.location,
      availableActions: this.getAvailableAction(),
      state: this.state
    })
  }
}
