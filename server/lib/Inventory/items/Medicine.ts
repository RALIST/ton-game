import Item from "@/lib/Inventory/Item";

export default class Medicine extends Item {
  recoveryAmount!: number

  constructor(id: number, name: string, description: string) {
    super(id, name, description);

    this.itemType = "medicine"
    this.usable = true
    this.equipable = false
    this.stackable = true
    this.tradeable = true
    this.recoveryAmount = 10
  }
}
