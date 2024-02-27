// it's a hack to run consumers on server startup

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    import("@/lib/services/gameplayService");
  }
}
