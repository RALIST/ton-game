import style from "./Header.module.css";
import Energy from "./Energy";

export default function Header({character}: { character: any}) {
  const currentHealth = character.stats.find((stat: { name: string; }) => stat.name === "CURRENT_HIT_POINTS").value
  const maxHealth = character.stats.find((stat: { name: string; }) => stat.name === "MAXIMUM_HIT_POINTS").value
  const fatique = character.stats.find((stat: { name: string; }) => stat.name === "FATIQUE").value

  return <header className={style.header}>
    <div>{character.name}</div>
    <Energy icon={'❤️'} color={'red'} value={currentHealth} max={maxHealth}/>
    <Energy icon={'⚡'} color={'darkorange'} value={100 - fatique} max={100}/>
  </header>
}
