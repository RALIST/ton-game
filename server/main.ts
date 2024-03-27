import Application from "@/src/infrostructure/Application";

Application.start()

process.on("SIGINT", async ()=> { await Application.stop() })
process.on("SIGTERM", async ()=> { await Application.stop() })
