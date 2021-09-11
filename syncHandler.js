import "./docs.js";
import { exec } from "https://deno.land/x/exec/mod.ts";
import { logger } from "./logger.js";
import { utils } from "./util.js"

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
      this.backupProcedure.forEach((procedure) => {
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
    let splitCommands = utils.splitCommand(command)

    if (splitCommands) {
      var process = Deno.run({
        cmd: splitCommands,
        stderr: "null",
        stdin: "null",
        stdout: "null"
      })
      await process.status()
    }
  }
}

/**
 * Creates an rsync command for the syncPath parameter.
 * @param {SyncPath} syncPath where to sync files.
 */
function createCommand(syncPath, dryRun) {
  let exclude = new String("");

  if (syncPath.exclude && syncPath.exclude.length > 0) {
    syncPath.exclude.map((ex) => {
      exclude += `--exclude ${ex} `;
    });
  }

  return `rsync -arptgouE ${exclude.trimEnd()} ${syncPath.origin} ${syncPath.destination}`;
}
