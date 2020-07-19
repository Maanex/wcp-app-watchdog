

declare interface ConfigData {

  /** Configure remote logging */
  remote?: {

    /** Remote server url */
    url: string

    /** Remote server authentification */
    auth: string

  },

  /** Define what services the watchdog watches over */
  watch?: {

    /** Processes running on the same virtual machine and are able to be spawned in via command line */
    processes?: ProcessData[]

  }

}


/** Configuration for a single process to watch over */
export interface ProcessData {

  /** An id to identify the process. Must be unique */
  id: string,

  /** A command to run once, before starting the process. Will not get re-run if the process restarts */
  prepare?: string,

  /** A command to start the service for the first time. If no "restart" command was defined, this command will be used for restarting as well */
  start: string,

  /** A command to restart the service after it crashed. If not defined, the "start" command will be run instead */
  restart?: string,

  /** Define system environment variables for the runtime. KEY=VALUE;KEY=VALUE */
  env?: string,

  /** Set to true in order to not log any information of this process to the remote server */
  disableRemote?: boolean,

  /** The amount of time to wait between the process failing and the watchdog restarting in ms */
  restartDelay?: number,

  /** Used to spawn in multiple instances of the same process. Use $ in any of the other settings to reference this instance's uuid */
  spawn?: (string | number)[],

  /** A cron timer to restart the service periodically */
  scheduledRestart?: string

}
