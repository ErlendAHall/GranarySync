import "./docs.js";

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
  optionsPath: "/usr/local/bin/granarysync/options.json",

  /**
   * Reads the options file.
   * @returns {Options|undefined} syncpaths
   */
  read: async function readOptions() {
    if (this.optionsPath) {
      let decoder = new TextDecoder("utf-8");
      let textContent = await Deno.readFile(this.optionsPath);
      let decodedData = decoder.decode(textContent);
      return JSON.parse(decodedData);
    } else {
      throw Error("No options path was defined.");
    }
  },
};
