import itemsData from "@/lib/Inventory/data/items.json"
import {itemFromType} from "@/lib/Inventory/helpers";
import {ShopItem} from "@/lib/Shop/types";

export default class ShopModel {
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
