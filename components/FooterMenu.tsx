import {useWebSocket} from "@/components/WebSocketContext";

export default function FooterMenu(){
  const ws = useWebSocket()

  function setScene(scene: string) {
    return () => {
      ws?.send(JSON.stringify({action: "changeScreen", payload: {scene: scene, userId: 1}}))
    }
  }

  return(
    <div className={"gameFooter"}>
      <div className={"button"} onClick={setScene("character")}>Персонаж</div>
      <div className={"button"} onClick={setScene("inventory")}>Инвентарь</div>
      <div className={"button"} onClick={setScene("map")}>Карта</div>
      <div className={"button"} onClick={setScene("map")}>Чат</div>
    </div>
  )
}
