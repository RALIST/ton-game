import {useEffect} from "react";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/GameCommands";
import {useWebSocket} from "@/components/WebSocketContext";

export default function Shop({shop, balance}: {shop: any, balance: number}) {
  const backButton = useBackButton()
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  function buy(item: any) {
    return () => {
      ws?.send(JSON.stringify({action: GameCommands.BUY_ITEM, userId: userId, payload: { item: item }}))
    }
  }

  useEffect(() => {
    backButton.show()
  }, [backButton]);

  return (
    <div className={"gameScreen"}>
      <div className={"screen"}>
        <div className={"title"}>{shop.name}</div>
        <div className={"title"}>Твой баланс {balance} </div>
        {shop.items.map((shopItem: any, index: number) => {
          return <div key={index}>
            {shopItem.item.name} {shopItem.count} шт. {shopItem.price}
            <div className={"button"} onClick={buy(shopItem)}> Купить </div>
          </div>
        })}
      </div>

    </div>
  )

}
