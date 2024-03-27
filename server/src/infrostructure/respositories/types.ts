export interface IRepository {
  load: () => Promise<any>
  save: (data: any) => Promise<void>
  update: (data: any) => Promise<void>
}
