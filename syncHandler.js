import "./docs.js"
import { exec } from "https://deno.land/x/exec/mod.ts"
import { logger } from "./logger.js"

/**
 * Creates the sync handler.
 * @param {SyncPath[]} syncPaths
 * @returns {SyncHandler} The synchandler.
 */
export function createSyncHandler(syncPaths) {
  /** @type SyncHandler */
  let syncHandler = Object.create({}, Object)

  syncHandler.backupProcedure = undefined
  syncHandler.syncPaths = syncPaths
  syncHandler.setup = function setupPaths() {
    this.backupProcedure = this.syncPaths.map((syncPath) => {
      return createBackupProcedure(syncPath)
    })
  }

  syncHandler.runAllBackups = function runRsync() {
    if (Array.isArray(this.backupProcedure)) {
      console.info("running backups")
      this.backupProcedure.forEach((procedure) => {
        console.log(procedure)
        if (procedure instanceof Function) {
          procedure()
        }
      })
    } else {
      logger.writeToLog(
        "exception",
        "The backup procedure has not been initialized."
      )
    }
  }

  return syncHandler
}

/**
 *
 * @param {SyncPath} syncPath
 * @param {string[]} commands
 * @returns {Function}
 */
function createBackupProcedure(syncPath) {
  return async function runBackup() {
    let command = createCommand(syncPath)

    if (command) {
      let response = await exec(command)
      console.log("%c⧭", "color: #aa00ff", response)
      logger.writeToLog("rsync", response.output)
    }
  }
}

/**
 * Creates an rsync command for the syncPath parameter.
 * @param {SyncPath} syncPath where to sync files.
 */
function createCommand(syncPath, dryRun) {
  return `rsync -arptgouE ${syncPath.origin} ${syncPath.destination}`
}
