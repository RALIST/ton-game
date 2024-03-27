import {ObjectTypes} from "@/src/domain/entities/GameObject/types";

export default class GameObject {
  id!: number // object id
  pid!: ObjectTypes // related proto id
  cid!: number // related character id
  sid!: number // related script id
  flags!: number // special flags
  owner!: GameObject // owner
  name!: string

  load() {}
  save() {}
}
