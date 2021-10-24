import "./docs.js"
import { optionsReader } from "./optionsReader.js"
import { logger } from "./logger.js"
import { syncHandler as syncer } from "./syncHandler.js"

const args = Deno.args

if (Array.isArray(args) && args.length > 0) {
  // Backup prodecure runs on demand.
  if (args.find((arg) => arg === "--run-once")) {
    void start(true)
  } else if (args.find((arg) => arg !== "--run-once" || arg !== "--debug")) {
    logger.writeToLog(
      "exception",
      "The argument(s) " + args.join(",") + "are not valid"
    )
    // Backup procedure is running on an interval.
  } else {
    start()
  }
}

async function start(runOnce) {
  if (Reflect.has(optionsReader, "read")) {
    /** @type Options */
    var options = await optionsReader.read()
    let backupInstructions = getBackupInstructions()

    if (backupInstructions.backupInterval) {
      /** @type SyncHandler */
      let syncHandler = Reflect.construct(
        syncer,
        backupInstructions.backupTargets
      )

      if (Reflect.has(syncHandler, "setup")) {
        syncHandler.setup()
        console.info("GranarySync is running.")
        console.info("The following paths are handled:")
        console.info(syncHandler.syncPaths)

        if (runOnce) {
          logger.writeToLog("runtime", "Running single backups...")
          syncHandler.runAllBackups()
        } else {
          setInterval(function doBackUp() {
            logger.writeToLog("runtime", "Running periodic backups...")
            syncHandler.runAllBackups()
          }, backupInstructions.backupInterval)
        }
      }
    }
  } else {
    logger.writeToLog("exception", "No backup interval is specified.")
  }

  /**
   * Creates a backup instructions object based on the number of backups per day.
   * @returns {BackupInstructions|undefined}
   */
  function getBackupInstructions() {
    let backupInterval = (function setInterval() {
      if (
        Reflect.has(options, "backupsPerDay") &&
        !Number.isNaN(options.backupsPerDay) &&
        options.backupsPerDay !== 0
      ) {
        let interval = 24 / options.backupsPerDay
        return interval * 60 * 60 * 1000
      } else {
        logger.writeToLog("exception", "backup interval is malformed, halting")
        return undefined
      }
    })()

    return {
      backupInterval: backupInterval,
      backupTargets: options.syncPaths
    }
  }
}
