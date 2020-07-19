import { loadConfig } from "./config"
import { initRemoteServer } from "./remote-server"
import { initWatchdog } from "./watchdog"



async function run() {
  const config = await loadConfig()
  if (config.remote) initRemoteServer(config)
  if (config.watch) initWatchdog(config)
}

run()
