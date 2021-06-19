import "./docs.js";
import { optionsReader } from "./optionsReader.js";
import { logger } from "./logger.js";
import { createSyncHandler } from "./syncHandler.js";

console.info("starting");
start();

async function start() {
  /** @type Options */
  let options = await optionsReader.read();
  let backupInstructions = getBackupInstructions();

  if (backupInstructions.backupInterval) {
    let syncHandler = createSyncHandler(backupInstructions.backupTargets);
    syncHandler.setup();

    console.info("GranarySync is running.")
    console.info("The following paths are handled:")
    console.info(syncHandler.syncPaths)
    setInterval(function doBackUp() {
      logger.writeToLog("runtime", "Running backups...")
      syncHandler.runAllBackups();
    }, backupInstructions.backupInterval);
  } else {
    logger.writeToLog("exception", "No backup interval is specified.")
  }

  /**
   * Creates a backup instructions object based on the number of backups per day.
   * @returns {BackupInstructions}
   */
  function getBackupInstructions() {
    let backupInterval = (function setInterval() {
      if (!Number.isNaN(options.backupsPerDay)) {
        let interval = 24 / options.backupsPerDay;
        return interval * 60 * 60 * 1000;
      } else {
        logger.writeToLog("exception", "backup interval is malformed, halting");
        return undefined;
      }
    })();

    return {
      backupInterval: backupInterval,
      backupTargets: options.syncPaths,
    };
  }
}
