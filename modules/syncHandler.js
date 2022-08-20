import "../docs/types.js";
import { logger } from "./logger.js";
import { utils } from "../utils/util.js";

/**
 * Creates the sync handler.
 * @param {SyncPath[]} syncPaths
 * @returns {SyncHandler} The synchandler.
 */
function syncHandler(syncPaths, globalInterval) {
  /** @type SyncHandler */
  let syncHandler = Object.create({}, Object)

  Reflect.defineProperty(syncHandler, "backupProcedure", {
    value: undefined,
    writable: true
  })
  Reflect.defineProperty(syncHandler, "syncPaths", {
    value: syncPaths,
    writable: false
  })
  Reflect.defineProperty(syncHandler, "setup", {
    value: function setupPaths() {
      this.backupProcedure = this.syncPaths.map((syncPath) => {
        return createIntervalledBackupProcedure(syncPath, globalInterval)
      })
    },
    writable: false
  })
  Reflect.defineProperty(syncHandler, "runAllBackups", {
    value: function runRsync() {
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
    },
    writable: false
  })

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
    let splitCommands = utils.splitCommands(command)

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
 *
 * @param {SyncPath} syncPath
 * @param {string[]} globalInterval
 * @returns {Function}
 */
function createIntervalledBackupProcedure(syncPath, globalInterval) {
  if (globalInterval == undefined && syncPath.backupInterval == undefined) {
    logger.writeToLog("exception", "Could not determine a proper backup interval.")
    throw new Error("Backup interval is a falsey value.")
  }

  return setInterval(runBackup, syncPath.backupInterval)
  async function runBackup() {
    let command = createCommand(syncPath)
    let splitCommands = utils.splitCommands(command)

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
 * @param {SyncPath} syncPath - where to sync files
 * @param {boolean} dryRun - command will be dry run
 */
function createCommand(syncPath, dryRun) {
  let exclude = new String("");

  if (syncPath.exclude && syncPath.exclude.length > 0) {
    syncPath.exclude.map((ex) => {
      exclude += `--exclude ${ex} `;
    });
  }

  return `rsync ${dryRun ? "--dry-run" : ""} -arptgouE ${exclude.trimEnd()} ${syncPath.origin} ${syncPath.destination}`;
}

export {syncHandler}