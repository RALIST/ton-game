export type LogEntry = {
  message: string,
  type: string
}

export class GameLogger {
  logs!: LogEntry[]

  constructor() {
    this.logs = []
  }

  logEvent(message: string, type: string) {
    this.logs.push({message: message, type: type})
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
}
