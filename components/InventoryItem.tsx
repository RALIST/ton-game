import {InventoryItemData} from "@/lib/game/InventoryItems";
import {useWebSocket} from "@/components/WebSocketContext";
import {useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/GameCommands";

export default function InventoryItem({item, count, equipped}: InventoryItemData) {
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  let button = null
  if (item.usable) {
    button = <div className={"smallButton"}>Use</div>
  }

  if (item.equipable) {
    if (!equipped) {
      const callback = () => {
        ws?.send(JSON.stringify({action: GameCommands.EQUIP_ITEM, userId: userId, payload: { itemId: item.id } }))
      }
      button = <div className={"smallButton"} onClick={callback}>Equip</div>
    } else {
      const callback = () => {
        ws?.send(JSON.stringify({action: GameCommands.UNEQUIP_ITEM, userId: userId, payload: { itemId: item.id } }))
      }
      button = <div className={"smallButton"} onClick={callback}>Unequip</div>
    }
  }

  return (
    <div className={"inventoryItem"}>
      <div className={"itemName"}>{item.name} {count}шт.</div>
      <div className={"itemDescription"}>{item.description}</div>
      <div className={"itemDescription"}>Type: {item.itemType}</div>
      {button}
    </div>
  )
}
