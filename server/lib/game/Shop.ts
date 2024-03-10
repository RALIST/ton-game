import itemsData from "@/lib/data/items.json"
import {itemFromType} from "@/lib/game/items/helpers";
import {ShopItem} from "@/types/gameplay";

export default class Shop {
  name!: string;
  items!: ShopItem[]

  constructor() {
    this.name = "Basic shop"
    this.items = itemsData.map(item => {
      return {
        item: itemFromType(item),
        count: 10,
        price: 100
      }
    })
  }
}
