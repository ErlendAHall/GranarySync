import { utils } from "./util.js";

export let logger = {
  logPath: "/var/log/granarysync",

  /**
   * Creates a single log line entry.
   * @param {"exception"|"rsync"|"azure"|"runtime"} type
   * @param {string} message
   * @returns {Uint8Array} The new log entry.
   */
  createLogEntry: function createLogEntry(type, message) {
    let dateToday = new Date().toUTCString();
    let entry = `[${type.toLocaleUpperCase()}] ${message} ${dateToday}\n`;
    return utils.encodeText(entry);
  },

  /**
   * Writes a new log entry.
   * @param {"exception"|"rsync"|"azure"|"runtime"} type
   * @param {string} message
   * @returns {Promise<void>} void
   */
  writeToLog: async function writeToLogBasedOnType(type, message) {
    let dateToday = new Date().toISOString();

    switch (type) {
      case "exception":
      case "rsync":
      case "azure":
      case "runtime":
        await Deno.writeFile(
          `${this.logPath}/${dateToday}.log`,
          this.createLogEntry(type, message),
        );
        break;
    }
  },
};
