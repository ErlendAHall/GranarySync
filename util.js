export let utils = {
  /**
   * Converts a plain string primitive to UInt8Array encoded text.
   * @param {string} text
   * @returns {Uint8Array} The encoded text.
   */
  encodeText: function encodeText(text) {
    if (text) {
      let encoder = new TextEncoder()
      return encoder.encode(text)
    } else {
      return encoder.encode("Log entry input was undefined.")
    }
  },
  /**
   * Splits an incoming command into its parts.
   * @param {string} command
   * @returns {string[]} List of stdin commands.
   */
  splitCommands: function splitCommand(command) {
    let cmdRegExp = /[^\s"]+|"([^"]*)"/gi
    let splits = []

    do {
      //Each call to exec returns the next regex match as an array
      var match = cmdRegExp.exec(command)
      if (match != null) {
        //Index 1 in the array is the captured group if it exists
        //Index 0 is the matched text, which we use if no captured group exists
        splits.push(match[1] ? match[1] : match[0])
      }
    } while (match != null)

    return splits
  },

  getEnvironment: function getEnvironment() {
    const args = Deno.args
    if (Array.isArray(args) && args.length > 0) {
      if (args.length > 0 && args.find((arg) => arg === "--debug")) {
        return "debug"
      }
    }

    return "prod"
  }
}
