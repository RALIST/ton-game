import Item from "@/lib/Item";

export default function InventoryItem({item}: {item: Item}) {
  return (
    <div className={"inventoryItem"}>
      <div className={"itemName"}>{item.name}</div>
      <div className={"itemDescription"}>{item.description}</div>
    </div>
  )
}