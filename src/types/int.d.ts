import { ProcessData } from "./config";
import { ChildProcessWithoutNullStreams } from "child_process";


export interface WatchdogProcess {

  config: ProcessData,

  running: boolean,

  childProcess: ChildProcessWithoutNullStreams

}