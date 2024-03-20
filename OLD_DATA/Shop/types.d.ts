export type Shop = {
  name: string;
  items: ShopItem[]
}

export type ShopItem  = {
  item: Item,
  count: number,
  price: number
}
