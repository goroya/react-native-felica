/**
 * Felica Command List
 * @type {Object}
 */
const FELICA_COMMAND = {
  CC_POLLING: 0x00,
  RC_POLLING: 0x01,
  CC_REQUEST_SERVICE: 0x02,
  RC_REQUEST_SERVICE: 0x03,
  CC_REQUEST_RESPONCE: 0x04,
  RC_REQUEST_RESPONCE: 0x05,
  CC_READ_WITHOUT_ENCRYPTION: 0x06,
  RC_READ_WITHOUT_ENCRYPTION: 0x07,
  CC_WRITE_WITHOUT_ENCRYPTION: 0x08,
  RC_WRITE_WITHOUT_ENCRYPTION: 0x09,
  CC_SEARCH_SERVICE_CODE: 0x0A,
  RC_SEARCH_SERVICE_CODE: 0x0B,
  CC_REQUEST_SYSTEM_CODE: 0x0C,
  RC_REQUEST_SYSTEM_CODE: 0x0D,
  CC_AUTHENTICATION1: 0x10,
  RC_AUTHENTICATION1: 0x11,
  CC_AUTHENTICATION2: 0x12,
  RC_AUTHENTICATION2: 0x13,
  CC_READ: 0x14,
  RC_READ: 0x15,
  CC_Write: 0x16,
  RC_Write: 0x17,
  CC_REQUEST_SERVICE_V2: 0x32,
  RC_REQUEST_SERVICE_V2: 0x33,
  CC_GET_SYSTEM_STATUS: 0x38,
  RC_GET_SYSTEM_STATUS: 0x39,
  CC_REQUEST_SPECIFICATION_VERSION: 0x3C,
  RC_REQUEST_SPECIFICATION_VERSION: 0x3C,
  CC_RESET_MODE: 0x3E,
  RC_RESET_MODE: 0x3E,
  CC_AUTHENTICATION1V2: 0x40,
  RC_AUTHENTICATION1V2: 0x41,
  CC_AUTHENTICATION2V2: 0x42,
  RC_AUTHENTICATION2V2: 0x43,
  CC_ReadV2: 0x44,
  RC_ReadV2: 0x45,
  CC_WriteV2: 0x46,
  RC_WriteV2: 0x47,
  CC_UPDATE_RANDOM_ID: 0x4C,
  RC_UPDATE_RANDOM_ID: 0x4C
};

export default FELICA_COMMAND;
module.exports = FELICA_COMMAND;
