import {GameplayEvents} from "@/lib/utils/GameEvents";
import Enemy from "@/lib/game/Enemy";

import enemiesData from "@/lib/data/enemies.json"
import itemsData from "@/lib/data/items.json"
import eventsData from "@/lib/data/events.json"

import Item from "@/lib/game/Item";
import RandomEvent from "@/lib/game/RandomEvent";
import StreamEvent from "@/lib/streams/StreamEvent";

export class Gameplay {
  userId: number;

  constructor(userId: number) {
    this.userId = userId
  }

  async handleEvent(event: string, _payload: any) {
    switch (event) {
      case GameplayEvents.CHARACTER_MOVED: {
        await this.handleCharacterMoved()
        break;
      }
      case GameplayEvents.LOOK_STARTED: {
        await this.handleCharacterLook()
        break;
      }
    }
  }

  async handleCharacterMoved() {
    const streamEvent = new StreamEvent()
    if (Math.random() < 0.3) {
      const newPayload = {enemy: this.randomEnemy()}
      await streamEvent.enemiesFound(this.userId, newPayload).send()
    } else if(Math.random() < 0.2) {
      const newPayload = {event: this.randomEvent()}
      await streamEvent.randomEventFound(this.userId, newPayload).send()
    } else {
      await streamEvent.actionCompleted(this.userId, {status: "idle"}).send()
    }
  }

  async handleCharacterLook() {
    const streamEvent = new StreamEvent()
    const payload = {}
    if(Math.random() < 0.4) {
      const item = this.randomItem()
      const newPayload = {...payload, item: item}
      await streamEvent.itemsFound(this.userId, newPayload).send()
      await streamEvent.itemAdded(this.userId, {item: item.id}).send()
      await streamEvent.lookCompleted(this.userId, payload).send()
      await streamEvent.actionCompleted(this.userId, {status: "looked"}).send()
    } else if(Math.random() < 0.2) {
      await streamEvent.dangerEventFound(this.userId, payload).send()
      await streamEvent.characterAttributesChanged(this.userId, {
        health: { type: "subtract", value: 1 }
      }).send()
      await streamEvent.lookCompleted(this.userId, payload).send()
      await streamEvent.actionCompleted(this.userId, {status: "looked"}).send()
    } else {
      await streamEvent.nothingFound(this.userId, payload).send()
      await streamEvent.lookCompleted(this.userId, payload).send()
      await streamEvent.actionCompleted(this.userId, {status: "looked"}).send()
    }
  }

  randomEnemy(): Enemy {
    const randomEnemy = enemiesData[(Math.floor(Math.random() * enemiesData.length))]
    return Object.assign(randomEnemy, Enemy)
  }

  randomItem(): Item {
    const randomItem = itemsData[(Math.floor(Math.random() * itemsData.length))]
    return Object.assign(randomItem, Item)
  }

  randomEvent(): RandomEvent {
    const randomEvent = eventsData[(Math.floor(Math.random() * eventsData.length))]
    return Object.assign(randomEvent, RandomEvent)
  }
}
