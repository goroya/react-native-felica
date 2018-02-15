class Util {
  /**
   *
   * @param {String} str
   * @returns {Array}
   */
  static stringHex2Byte(str) {
    const data = [];
    for (let i = 0; i < str.length; i += 2) {
      data.push(parseInt(str.substr(i,2), 16));
    }
    return data;
  }

  /**
   *
   * @param {(Array.<Number>)} byteArray
   * @returns {string}
   */
  static byteToHexString(byteArray) {
    let data = '';
    for (let i = 0; i < byteArray.length; i++) {
      const hex = (byteArray[i] & 0xff).toString(16);
      data +=  ('00' + hex).slice(-2) + " ";
    }
    return data.toUpperCase();
  }
}

export default Util;
module.exports = Util;
