export default function Stats({currentHealth, maxHealth, endurance, maxEndurance}: {
  currentHealth: number,
  maxHealth: number,
  endurance: number,
  maxEndurance: number
}) {
  return (
    <div className={"characterStats"}>
      <div>❤️ {currentHealth}/{maxHealth}</div>
      <div>⚡ {endurance}/{maxEndurance}</div>
    </div>
  )
}
