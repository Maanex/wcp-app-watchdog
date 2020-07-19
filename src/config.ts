import ParseArgs from "./lib/parse-args"
import { readFileSync } from "fs"
import { ConfigData } from "./types/config"
import { join as pathJoin } from "path"


export async function loadConfig(): Promise<ConfigData> {
  const args = ParseArgs.parse(process.argv || [])
  const path = args.config
    ? (args.config + '')
    : pathJoin(__dirname, '..', 'config.json')
  const contents = readFileSync(path).toString()
  const parsed = JSON.parse(contents)

  return parsed as ConfigData

}