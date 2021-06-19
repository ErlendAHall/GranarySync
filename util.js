export let utils = {
  /**
   * Converts a plain string primitive to UInt8Array encoded text.
   * @param {string} text
   * @returns {Uint8Array} The encoded text.
   */
  encodeText: function encodeText(text) {
    if (text) {
      let encoder = new TextEncoder();
      return encoder.encode(text);
    } else {
      return encoder.encode("Log entry input was undefined.");
    }
  },
};
