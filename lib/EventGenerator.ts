import {GeneratorEvents} from "@/lib/utils/gameEvents";
import Enemy from "@/lib/Enemy";

import enemiesData from "@/lib/data/enemies.json"
import itemsData from "@/lib/data/items.json"
import eventsData from "@/lib/data/events.json"

import Item from "@/lib/Item";
import RandomEvent from "@/lib/RandomEvent";
import StreamEvent from "@/lib/streams/StreamEvent";

export class EventGenerator {
  userId: number;

  constructor(userId: number) {
    this.userId = userId
  }

  async handleEvent(event: string, payload: any) {
    const streamEvent = new StreamEvent()

    switch (event) {
      case GeneratorEvents.CHARACTER_MOVED: {
        if (Math.random() < 0.3) {
          const newPayload = {...payload, enemy: this.randomEnemy()}
          await streamEvent.enemiesFound(this.userId, newPayload).send()
        } else if(Math.random() < 0.2) {
          const newPayload = {...payload, event: this.randomEvent()}
          await streamEvent.randomEventFound(this.userId, newPayload).send()
        } else {
          await streamEvent.actionCompleted(this.userId, {status: "idle"}).send()
        }
        break;
      }
      case GeneratorEvents.LOOK_STARTED: {
        if(Math.random() < 0.4) {
          const newPayload = {...payload, item: this.randomItem()}
          await streamEvent.itemsFound(this.userId, newPayload).send()
          await streamEvent.lookCompleted(this.userId, payload).send()
          await streamEvent.actionCompleted(this.userId, {status: "looked"}).send()
        } else if(Math.random() < 0.2) {
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

        break;
      }
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
