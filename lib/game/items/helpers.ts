import Weapon from "@/lib/game/items/Weapon";
import Armor from "@/lib/game/items/Armor";
import Medicine from "@/lib/game/items/Medicine";
import Item from "@/lib/game/Item";
import Supply from "@/lib/game/items/Supply";

export function fromType(item: {id: number, name: string, description: string, itemType: string}) {
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
