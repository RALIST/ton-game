export type LogEntry = {
  message: string,
  type: string
}

export class GameLogger {
  globalLogs!: LogEntry[]
  currentLogs!: LogEntry[]

  constructor() {
    this.globalLogs = []
    this.currentLogs = []
  }

  clearLogs() {
    this.currentLogs = []
  }

  handleAction(action: string, payload: any) {
  }

  logEvent(message: string, type: string) {
    this.logGlobalEvent(message, type)
    this.logCurrentEvent(message, type)
  }

  logGlobalEvent(message: string, type: string) {
    this.globalLogs.push({message: message, type: type})
  }

  logCurrentEvent(message: string, type: string) {
    this.currentLogs.push({message: message, type: type})
  }

  info(message: string) {
    this.logEvent(message, "info")
  }

  alert(message: string) {
    this.logEvent(message, "alert")
  }

  success(message: string) {
    this.logEvent(message, "success")
  }

  toJson(includeGlobal = false) {
    if (includeGlobal) return {...this}

    return {
      currentLogs: this.currentLogs
    }
  }
}
