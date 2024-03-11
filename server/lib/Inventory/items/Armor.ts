import Item from "@/lib/Inventory/Item";

export default class Armor extends Item {
  defense!: number

  constructor(id: number, name: string, description: string) {
    super(id, name, description);

    this.itemType = "armor"
    this.usable = false
    this.equipable = true
    this.stackable = false
    this.tradeable = true
    this.defense = 10
  }
}
