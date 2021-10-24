import { utils } from "./util.js";

const LOGPATHS = {
  prod: "/var/log/granarysync",
  debug: "/granary/edev/GranarySync/playground/log"
}
Object.freeze(LOGPATHS)

export let logger = {
  logPath: utils.getEnvironment() === "debug" ? LOGPATHS.debug : LOGPATHS.prod,
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  /**
   * Creates a single log line entry.
   * @param {"exception"|"rsync"|"azure"|"runtime"} type
   * @param {string} message
   * @returns {Uint8Array|undefined} The new log entry.
   */
  createLogEntry: function createLogEntry(type, message) {
    if (Reflect.has(utils, "encodeText")) {
      let dateToday = new Date().toUTCString()
      let entry = `[${type.toLocaleUpperCase()}] ${message} ${dateToday}\n`
      return utils.encodeText(entry)
    }
  },

  /**
   * Writes a new log entry.
   * @param {"exception"|"rsync"|"azure"|"runtime"} type
   * @param {string} message
   * @returns {Promise<void>} void
   */
  writeToLog: async function writeToLogBasedOnType(type, message) {
    let dateToday = new Date()
    let formattedDate = `${dateToday.getDate()}-${
      this.months[dateToday.getMonth()]
    }-${dateToday.getFullYear()}`

    switch (type) {
      case "exception":
        await Deno.writeFile(
          `${this.logPath}/(exception)${formattedDate}.log`,
          this.createLogEntry(type, message),
          { append: true }
        )
        break
      case "rsync":
      case "azure":
      case "runtime":
        await Deno.writeFile(
          `${this.logPath}/${formattedDate}.log`,
          this.createLogEntry(type, message),
          { append: true }
        )
        break
    }
  }
}
