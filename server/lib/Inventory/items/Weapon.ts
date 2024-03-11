import Item from "@/lib/Inventory/Item";

export default class Weapon extends Item {
  attack!: number

  constructor(id: number, name: string, description: string) {
    super(id, name, description);

    this.itemType = "weapon"
    this.usable = false
    this.equipable = true
    this.stackable = false
    this.tradeable = true
    this.attack = 10
  }
}
