import {Item} from "@/types/gameplay";

export type InventoryItem = {
  item: Item,
  count: number,
  equipped?: boolean
}

export type Inventory = {
  userId: number,
  items: InventoryItem[]
}

export type Item = {
  id: number
  name: string
  itemType: string
  description: string
  stackable: boolean
  equipable: boolean
  tradeable: boolean
  usable: boolean
}
