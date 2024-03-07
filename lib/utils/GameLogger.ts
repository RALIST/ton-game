import LoggerRepository from "@/lib/repositories/LoggerRepository";

export type LogEntry = {
  message: string,
  type: string
}

export default  class GameLogger {
  globalLogs!: LogEntry[]
  currentLogs!: LogEntry[]
  userId: number;
  repo!: LoggerRepository

  constructor(userId: number) {
    this.globalLogs = []
    this.currentLogs = []
    this.userId = userId
    this.repo = new LoggerRepository(userId)
  }


  async load() {
    const data = await this.repo.loadLoggerData()
    this.currentLogs = data?.currentLogs ?? []
    this.globalLogs = data?.globalLogs ?? []

    if (!data) await this.repo.dump(this)

    return this
  }

  private async append(arr: string, item: any) {
    await this.repo.append(arr, item)
  }

  async clearLogs() {
    this.currentLogs = []
    await this.repo.update({currentLogs: []})
  }

  async logEvent(message: string, type: string) {
    await this.append("currentLogs", {message: message, type: type})
    await this.append("globalLogs", {message: message, type: type})
  }
  
  toJson() {
    return {currentLogs: this.currentLogs}
  }

  handleMoveStarted(payload: any) {
    return Promise.resolve(undefined);
  }

  handleCharacterTired(payload: any) {
    return Promise.resolve(undefined);
  }

  handleRandomEventFound(payload: any) {
    return Promise.resolve(undefined);
  }

  handleDangerEventFound(payload: any) {
    return Promise.resolve(undefined);
  }

  handleEnemiesFound(payload: any) {
    return Promise.resolve(undefined);
  }

  handleItemsFound(payload: any) {
    return Promise.resolve(undefined);
  }

  handleCharacterAttributesChanged(payload: any) {
    return Promise.resolve(undefined);
  }

  handleCharacterAttackCompleted(payload: any) {
    return Promise.resolve(undefined);
  }

  handleNothingFound(payload: any) {
    return Promise.resolve(undefined);
  }

  handleRestCompleted(payload: any) {
    return Promise.resolve(undefined);
  }

  handleRunCompleted(payload: any) {
    return Promise.resolve(undefined);
  }
}
