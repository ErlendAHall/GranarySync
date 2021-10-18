import "./docs.js"
import { optionsReader } from "./optionsReader.js"
import { logger } from "./logger.js"
import { syncHandler as syncer } from "./syncHandler.js"

console.info("starting")
const args = Deno.args

if (Array.isArray(args) && args.length > 0 && args[0] === "config") {
  config()
} else {
  start()
}

async function config() {
  let wasmCode = await Deno.readFile(
    "target/wasm32-unknown-unknown/debug/granary_sync_options.wasm"
  )
  let instance = new WebAssembly.Instance(new WebAssembly.Module(wasmCode))
  let { main } = instance.exports
  console.log("%c⧭", "color: #e50000", main)
  main()
}

async function start() {
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
        setInterval(function doBackUp() {
          logger.writeToLog("runtime", "Running backups...")
          syncHandler.runAllBackups()
        }, backupInstructions.backupInterval)
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
