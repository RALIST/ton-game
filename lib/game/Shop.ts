import Item from "@/lib/game/Item";
import itemsData from "@/lib/data/items.json"

export type ShopItem  = {
  item: Item,
  count: number,
  price: number
}

export default class Shop {
  name!: string;
  items!: ShopItem[]

  constructor() {
    this.name = "Basic shop"
    this.items = itemsData.map(item => { return { item: item, count: 10, price: 100 } })
  }
}
