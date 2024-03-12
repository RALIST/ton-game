import Gameplay from "@/lib/Gameplay/Gameplay";
import {GameplayEvents} from "@/lib/utils/GameEvents";
import BaseService from "@/lib/utils/services/BaseService";
import Enemy from "@/lib/NPC/Enemy";
import enemiesData from "@/lib/NPC/data/enemies.json";
import Item from "@/lib/Inventory/Item";
import itemsData from "@/lib/Inventory/data/items.json";
import RandomEvent from "@/lib/Gameplay/RandomEvent";
import eventsData from "@/lib/Gameplay/data/events.json";
import {itemFromType} from "@/lib/Inventory/helpers";

export default class GameplayService extends BaseService {
  public static async consume(data: any) {
    const model = new Gameplay(data.userId)
    const instance = new GameplayService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Gameplay) {super(model)}

  private eventHandlers = {
    [GameplayEvents.CHARACTER_MOVED]: async () => {
      if (Math.random() < 0.3) {
        const newPayload = {enemy: this.randomEnemy()}
        await this.streamEvent.enemiesFound(this.model.userId, newPayload).send()
      // } else if(Math.random() < 0.2) {
      //   const newPayload = {event: this.randomEvent()}
      //   await this.streamEvent.randomEventFound(this.model.userId, newPayload).send()
      // } else {
      //   await this.streamEvent.actionCompleted(this.model.userId, {}).send()
      } else {
        await this.streamEvent.actionCompleted(this.model.userId, {}).send()
      }
    },

    [GameplayEvents.LOOK_STARTED]: async (payload: any) => {
      if(Math.random() < 0.4) {
        const item = this.randomItem()
        const newPayload = {...payload, item: item}
        await this.streamEvent.itemsFound(this.model.userId, newPayload).send()
        await this.streamEvent.itemAdded(this.model.userId, {item: item.id}).send()
        await this.streamEvent.lookCompleted(this.model.userId, payload).send()
        await this.streamEvent.actionCompleted(this.model.userId, {status: "looked"}).send()
      } else if(Math.random() < 0.2) {
        await this.streamEvent.dangerEventFound(this.model.userId, payload).send()
        await this.streamEvent.characterAttributesChanged(this.model.userId, {
          health: { type: "subtract", value: 1 }
        }).send()
        await this.streamEvent.lookCompleted(this.model.userId, payload).send()
        await this.streamEvent.actionCompleted(this.model.userId, {status: "looked"}).send()
      } else {
        await this.streamEvent.nothingFound(this.model.userId, payload).send()
        await this.streamEvent.lookCompleted(this.model.userId, payload).send()
        await this.streamEvent.actionCompleted(this.model.userId, {status: "looked"}).send()
      }
    }
  }

  randomEnemy(): Enemy {
    const randomEnemy = enemiesData[(Math.floor(Math.random() * enemiesData.length))]
    return Object.assign(randomEnemy, Enemy)
  }

  randomItem(): Item {
    const randomItem = itemsData[(Math.floor(Math.random() * itemsData.length))]
    return itemFromType(randomItem)
  }

  randomEvent(): RandomEvent {
    const randomEvent = eventsData[(Math.floor(Math.random() * eventsData.length))]
    return Object.assign(randomEvent, RandomEvent)
  }
}
