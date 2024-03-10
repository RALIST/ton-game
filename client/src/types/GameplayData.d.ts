type GameplayData = {
  character: {
    currentHealth: number,
    maxHealth: number,
    endurance: number,
    maxEndurance: number,
    balance: number
  },
  availableActions: string[],
  currentScene: string
}
