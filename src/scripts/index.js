
let NIEMMapping = require("niem-mapping");

let { Issue } = NIEMMapping;


/**
 * @param {Buffer} buffer
 * @returns {Issue[]}
 */
module.exports.validate = (buffer) => {
  let mapping = new NIEMMapping(buffer);
  Buffer.from()
  return mapping.loadErrors;
}
