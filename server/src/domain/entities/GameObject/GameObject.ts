import {ObjectTypes} from "@/src/domain/entities/GameObject/types";
import {IRepository} from "@/src/infrostructure/respositories/types";
import ObjectRepository from "@/src/infrostructure/respositories/ObjectRepository";

export default class GameObject {
  id!: number // object id
  pid!: ObjectTypes // related proto id
  flags!: number // special flags
  name!: string
  repo!: IRepository

  constructor() {
    this.repo = new ObjectRepository(this.id, this.constructor.name)
  }

  async load(): Promise<this> {
    const data = await this.repo.load()
    return this.fromData(data)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromData(_data: any) {
    return this
  }

  async save() {
    await this.repo.save(this)
  }
}
