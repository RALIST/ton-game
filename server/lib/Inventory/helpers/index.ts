import Weapon from "@/lib/Inventory/items/Weapon";
import Armor from "@/lib/Inventory/items/Armor";
import Medicine from "@/lib/Inventory/items/Medicine";
import Supply from "@/lib/Inventory/items/Supply";
import Item from "@/lib/Inventory/Item";


export function itemFromType(item: {id: number, name: string, description: string, itemType: string}) {
  switch (item.itemType) {
    case "weapon": {
      return new Weapon(item.id, item.name, item.description)
    }
    case "armor": {
      return new Armor(item.id, item.name, item.description)
    }
    case "medicine": {
      return new Medicine(item.id, item.name, item.description)
    }
    case "supply": {
      return new Supply(item.id, item.name, item.description)
    }
    default: {
      return new Item(item.id, item.name, item.description)
    }
  }
}
