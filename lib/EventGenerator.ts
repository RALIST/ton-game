import {GameplayEvents} from "@/lib/utils/enums";
import emitEvent from "@/lib/utils/events";
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
      case GameplayEvents.CHARACTER_MOVED: {
        if (Math.random() < 0.6) {
          // item chance 40%
          if(Math.random() < 0.4) {
            const newPayload = {...payload, item: this.randomItem()}
            await emitEvent(streamEvent.itemsFound(this.userId, newPayload), "gameplay")
          }
          // enemies chance 30%
          if(Math.random() < 0.3) {
            const newPayload = {...payload, enemy: this.randomEnemy()}
            await emitEvent(streamEvent.enemiesFound(this.userId, newPayload), "gameplay")
          }
        } else if(Math.random() < 0.1) { // random event chance 10%
          const newPayload = {...payload, event: this.randomEvent()}
          await emitEvent(streamEvent.randomEventFound(this.userId, newPayload), "gameplay")
        }

        await emitEvent(streamEvent.moveCompleted(this.userId, payload), "gameplay")
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
