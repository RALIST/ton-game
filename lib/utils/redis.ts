import {createClient} from "redis"

export const redis = createClient()
await redis.connect()
