let serviceStarted = false

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && !serviceStarted) {
    console.log("Instrumentation loading...")
    const {startGameplayService} = await import("@/lib/streams/gameplayConsumer");
    await startGameplayService();
    serviceStarted = true
  } else {
    console.log("Service already running!")
  }
}
