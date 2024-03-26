export interface IService {
  start: () => Promise<void>,
  stop: () => Promise<void>
}

export interface IEventHandler {
  handle: (message: any) => Promise<void>
}
