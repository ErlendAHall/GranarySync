import "./docs.js";
import { logger } from "./logger.js";
import { utils } from "./util.js";

/**
 * Creates the sync handler.
 * @param {SyncPath[]} syncPaths
 * @returns {SyncHandler} The synchandler.
 */
function syncHandler(...syncPaths) {
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
        return createBackupProcedure(syncPath)
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

export {syncHandler}