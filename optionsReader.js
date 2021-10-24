import "./docs.js";
import { utils } from "./util.js"

const OPTIONSPATH = {
  prod: "/usr/local/bin/granarysync/options.json",
  debug: "/granary/edev/GranarySync/options.json"
}
Object.freeze(OPTIONSPATH)

/**
 * @typedef OptionsReader
 * @type {object}
 * @property {function} read
 * @property {string} optionsPath
 * @returns {Options} SyncPath[]|undefined
 */

/** @type OptionsReader */
export let optionsReader = {
  /** @type {string} */
  optionsPath:
    utils.getEnvironment() === "debug" ? OPTIONSPATH.debug : OPTIONSPATH.prod,

  /**
   * Reads the options file.
   * @returns {Options|undefined} syncpaths
   */
  read: async function readOptions() {
    if (this.optionsPath) {
      let decoder = new TextDecoder("utf-8")
      let textContent = await Deno.readFile(this.optionsPath)
      let decodedData = decoder.decode(textContent)
      return JSON.parse(decodedData)
    } else {
      throw Error("No options path was defined.")
    }
  }
}
