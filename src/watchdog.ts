import { ProcessData, ConfigData } from "./types/config";
import { WatchdogProcess } from "./types/int";
import { spawn, exec } from "child_process";
import { platform as osPlatform } from "os"


export function initWatchdog(config: ConfigData) {
  const processes = config.watch.processes ?? []
  processes.forEach(monitorProcess)
}


const processes = new Map<string, WatchdogProcess>()


export async function monitorProcess(pd: ProcessData) {
  if (pd.spawn) {
    for (const uuid of pd.spawn) {
      const config = JSON.parse(JSON.stringify(pd)) as ProcessData
      for (const key of Object.keys(config)) {
        if ('string' !== typeof config[key]) continue
        config[key] = (config[key] as string).split('$').join(uuid + '')
      }
      config.spawn = undefined
      monitorProcess(config)
    }
    return;
  }

  console.log(`Spawning process ${pd.id}`)
  
  if (pd.prepare) await exec(pd.prepare)
  
  const cp = exec(generateStartCommand(pd.start, pd.env))
  cp.addListener('exit', () => restartProcess(pd.id))

  const obj: WatchdogProcess = {
    config: pd,
    running: false,
    childProcess: cp
  }

  processes.set(pd.id, obj)
}


export function restartProcess(id: string) {
  const process = processes.get(id)
  if (!process) throw `Error, process ${id} not found!`
  if (!process.childProcess.killed) process.childProcess.kill()

  console.log(`Process ${id} failed`)
  
  const start = () => {
    console.log(`Restarting process ${id}`)
    const cp = exec(generateStartCommand(process.config.restart ?? process.config.start, process.config.env))
    cp.addListener('exit', () => restartProcess(id))
  }
  
  if (process.config.restartDelay) setTimeout(start, process.config.restartDelay)
  else start()
}


export function dropProcess(id: string, terminate = true) {
  const process = processes.get(id)
  if (!process) throw `Error, process ${id} not found!`
  if (terminate) process.childProcess.kill()
  processes.delete(id)
}


function generateStartCommand(cmd: string, env?: string): string {
  if (!env) return cmd
  const os = osPlatform()
  if (os == 'win32') return `cmd /c"set ${env} && ${cmd}"`
  if (os == 'darwin') return cmd
  return `${env} ${cmd}`
}
