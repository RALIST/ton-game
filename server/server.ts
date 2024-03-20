import Game, {gIntervals, gPlayers} from "@/lib/Game/Game";
import startWsServer, {stopWsServer} from "@/wsServer";
import {startRedis, stopRedis} from "@/lib/Utils/redis/utils";
import {initStreams} from "@/lib/Utils/streams/utils";

async function start() {
  try {
    await startRedis()
    await initStreams()
    await Game.initialize()
    await startWsServer()
    console.log(gIntervals)
  } catch (error) { console.log("Internal server error:", error) }
}

async function stop() {
  gIntervals.forEach(interval => clearInterval(interval))

  gPlayers.forEach(async (player) => await player.save())
  gPlayers.clear()

  await stopRedis()
  await stopWsServer()
}

start()
  .then(() => { console.log("Game Server Started!") })
  .catch(error => { console.error("Internal server error:", error) })

process.on("SIGINT", ()=> {
  stop().then(() => {
    console.log("Server closed!");
    process.exitCode = 1
  })
})
