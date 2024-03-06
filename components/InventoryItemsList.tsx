import InventoryItem from "@/components/InventoryItem";
import {InventoryItemData} from "@/lib/game/InventoryItems";

export default function InventoryItemsList({items}: {items: InventoryItemData[]}) {
  return (
    <div className={"inventory"}>
      <div className={"title"}>Инвентарь</div>
      {
        items.map(({item, count}, index: any) => {
          return <InventoryItem item={item} count={count} key={index}/>
        })
      }
    </div>
  )
}
