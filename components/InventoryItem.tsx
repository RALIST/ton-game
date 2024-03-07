import Item from "@/lib/game/Item";

export default function InventoryItem({item, count}: {item: Item, count: number}) {
  return (
    <div className={"inventoryItem"}>
      <div className={"itemName"}>{item.name} {count}шт.</div>
      <div className={"itemDescription"}>{item.description}</div>
    </div>
  )
}
