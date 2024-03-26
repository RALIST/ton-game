import Application from "@/src/infrostructure/Application";
import RedisService from "@/src/infrostructure/services/RedisService";
import GameService from "@/src/infrostructure/services/GameService";
import WebSocketService from "@/src/infrostructure/services/WebSocketService";
import StreamService from "@/src/infrostructure/services/StreamService";

Application.registerService(new RedisService())
Application.registerService(new GameService())
Application.registerService(new StreamService())
Application.registerService(new WebSocketService())

Application.start()

process.on("SIGINT", async ()=> { await Application.stop() })
process.on("SIGTERM", async ()=> { await Application.stop() })
