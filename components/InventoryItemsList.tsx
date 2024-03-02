import InventoryItem from "@/components/InventoryItem";
import Item from "@/lib/Item";

export default function InventoryItemsList({items}: {items: Item[]}) {
  return (
    <div className={"inventory"}>
      {
        items.map((item: Item, index: any) => {
          return <InventoryItem item={item} key={index}/>
        })
      }
    </div>
  )
}
