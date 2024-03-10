import {useBackButton} from "@tma.js/sdk-react";
import {useEffect} from "react";
import {GameplayData} from "@lib/utils/GameRenderer";
import InventoryItemsList from "@/components/InventoryItemsList";

import "@/assets/inventory.css"

export default function Inventory({inventory}: {inventory: GameplayData["inventory"] | undefined}){
  const backButton = useBackButton()

  console.log(inventory)
  useEffect(() => {
    backButton.show();
  }, [backButton]);

  if (!inventory) {
    return <div>Something went wrong.</div>
  }

  return <InventoryItemsList items={inventory.items}/>
}
