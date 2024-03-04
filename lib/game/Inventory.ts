import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import itemsData from "@/lib/data/items.json"
import Item from "@/lib/game/Item";

export default class Inventory implements WithRedisStorage{
  userId: number
  storage!: RedisStorage
  items!: number[]

  constructor(userId: number) {
    this.userId = userId
    this.storage = new RedisStorage(`inventory:${this.userId}`)
    this.items = []
  }

  async handleEvent(event: string, payload: any) {
    switch(event) {
      case InventoryEvents.ITEM_ADDED: {
        await this.addItem(payload.item)
      }
    }
  }

  getItems(): Item[] {
    let characterItems: Item[] = [];

    this.items.map(itemId => {
      const item = itemsData.find(({id}) => itemId === id )
      if (item) characterItems.push(item)
    })

    return characterItems
  }

  async addItem(item: number){
    await this.storage.append("items", item)
  }

  async load() {
    const data = await this.storage.load()
    this.items = data?.items ?? []

    if (!data) {
      await this.dump()
    }

    return this
  }

  async dump(){
    await this.storage.dump(this.toJson())
  }

  toJson() {
    const {
      storage:_,
      ...props} = this

    return props
  }
}
