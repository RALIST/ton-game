import LoggerRepository from "@/lib/repositories/LoggerRepository";
import type {LogEntry} from "@/types/gameplay";

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
}
