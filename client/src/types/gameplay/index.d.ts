import {CharacterData} from "@/types/character";

export type GameplayData = {
  currentLogs: LogEntry[],
  character: CharacterData
  availableActions: string[],
  currentScene: string,
  currentLocation: any,
  inventory: Inventory,
  totalLocations: number,
  shop: Shop,
  error: string,
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

export type Shop = {
  name: string;
  items: ShopItem[]
}

export type ShopItem  = {
  item: Item,
  count: number,
  price: number
}

export type LogEntry = {
  message: string,
  type: string
}

export type InventoryItem = {
  item: Item,
  count: number,
  equipped?: boolean
}

export type Inventory = {
  userId: number,
  items: InventoryItem[]
}
