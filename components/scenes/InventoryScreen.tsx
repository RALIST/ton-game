import {useBackButton} from "@tma.js/sdk-react";
import {useEffect} from "react";
import {GameplayData} from "@/lib/utils/GameRenderer";
import InventoryItemsList from "@/components/InventoryItemsList";

import "@/assets/inventory.css"

export default function InventoryScreen({inventory}: {inventory: GameplayData["inventory"]}){
  const backButton = useBackButton()

  useEffect(() => {
    backButton.show();
  }, [backButton]);

  return <InventoryItemsList items={inventory.items}/>
}
