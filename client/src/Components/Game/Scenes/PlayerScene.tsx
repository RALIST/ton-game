export default function PlayerScene({player}: { player: any}) {
  return(
    <main>
      <div>
        {player.attributes.map((attr: { name: string; value: number }, index: number) => {
          return <div key={index}><span>{attr.name}</span> <span>{attr.value}</span></div>
        })}
      </div>
      <div>
        {player.stats.map((attr: { name: string; value: number }, index: number) => {
          return <div key={index}><span>{attr.name}</span> <span>{attr.value}</span></div>
        })}
      </div>
    </main>
  )
}
