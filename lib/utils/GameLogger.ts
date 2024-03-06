import {RedisStorage, WithRedisStorage} from "@/lib/repositories/RedisStorage";

export type LogEntry = {
  message: string,
  type: string
}

export default  class GameLogger implements WithRedisStorage{
  globalLogs!: LogEntry[]
  currentLogs!: LogEntry[]
  userId: number;
  storage!: RedisStorage

  constructor(userId: number) {
    this.globalLogs = []
    this.currentLogs = []
    this.userId = userId
    this.storage = new RedisStorage(`gamelogs:${this.userId}`)
  }


  async load() {
    const data = await this.storage.load()
    this.currentLogs = data?.currentLogs ?? []
    this.globalLogs = data?.globalLogs ?? []

    return this
  }

  private async dump() {
    await this.storage.dump(this.toJson())
  }

  private async append(arr: string, item: any) {
    await this.storage.append(arr, item)
  }

  async clearLogs() {
    this.currentLogs = []
    await this.storage.update({currentLogs: []})
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
