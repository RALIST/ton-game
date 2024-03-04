import {Character} from "@/lib/game/Character";
import {GameplayData} from "@/lib/utils/GameRenderer";

export default function HeaderMenu({character}: {character: GameplayData["character"]}) {
  return(
    <div className={"gameHeader"}>
      <div>❤️ {character.currentHealth}/{character.maxHealth}</div>
      <div>💶 {character.balance}</div>
      <div>⚡ {character.endurance}</div>
    </div>
  )
}
