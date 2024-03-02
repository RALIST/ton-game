import {Character} from "@/lib/Character";

export default function HeaderMenu({character}: {character: Character}) {
  return(
    <div className={"gameHeader"}>
      <div>❤️ {character.currentHealth}/{character.maxHealth}</div>
      <div>💶 {character.balance}</div>
      <div>⚡ {character.endurance}</div>
    </div>
  )
}
