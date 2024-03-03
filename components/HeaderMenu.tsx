import {Character} from "@/lib/Character";
import {GameplayData} from "@/lib/GameRenderer";

export default function HeaderMenu({character}: {character: GameplayData["character"]}) {
  return(
    <div className={"gameHeader"}>
      <div>❤️ {character.currentHealth}/{character.maxHealth}</div>
      <div>💶 {character.balance}</div>
      <div>⚡ {character.endurance}</div>
    </div>
  )
}
