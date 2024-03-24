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
  } catch (error) {
    await stop()
    console.log("Internal server error:", error)
  }
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
  .catch(async error => {
    console.error("Internal server error:", error);
    await stop()
  })

process.on("SIGINT", async ()=> {
  await stop()
  process.exitCode = 1
  console.log("Server closed!");
})
