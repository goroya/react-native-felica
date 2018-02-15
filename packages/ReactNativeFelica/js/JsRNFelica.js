import { NativeModules, DeviceEventEmitter } from 'react-native';
import { EventEmitter2 } from 'eventemitter2';
import FELICA_COMMAND from './FelicaCmd'
import Util from "./Util";
import AnalyzeFunc from "./analyze";

const { RNFelica } = NativeModules;
const eventEmitter2 = new EventEmitter2()

/**
 * Convert idm for argument to byte array
 * @param {(Array.<Number> | String)} idm
 * @returns {Array.<Number>}
 */
function argIdm2ByteIdm(idm){
  let byteIdm = null;
  if(Array.isArray(idm)){
    byteIdm = idm
  }else if (typeof idm === 'string' || idm instanceof String){
    byteIdm = Util.stringHex2Byte(idm)
  }else{
    return null
  }
  return byteIdm;
}

/**
 * Event Names
 * @type {
 *   {
 *     FELICA_DISCOVER: String,
 *     ANDROID_ON_NEW_INTENT: String,
 *     ANDROID_ON_ACTIVITY_RESULT: String,
 *     ANDROID_ON_HOST_RESUME: String,
 *     ANDROID_ON_HOST_PAUSE: String,
 *     ANDROID_ON_HOST_DESTROY: String
 *   }
 * }
 */
const RNFelicaEvent = {
  FELICA_DISCOVER: RNFelica.EVENT.FELICA_DISCOVER,
  ANDROID_ON_NEW_INTENT: RNFelica.EVENT.ANDROID_ON_NEW_INTENT,
  ANDROID_ON_ACTIVITY_RESULT: RNFelica.EVENT.ANDROID_ON_ACTIVITY_RESULT,
  ANDROID_ON_HOST_RESUME: RNFelica.EVENT.ANDROID_ON_HOST_RESUME,
  ANDROID_ON_HOST_PAUSE: RNFelica.EVENT.ANDROID_ON_HOST_PAUSE,
  ANDROID_ON_HOST_DESTROY: RNFelica.EVENT.ANDROID_ON_HOST_DESTROY,
};
for(const key in RNFelicaEvent){
  if(RNFelicaEvent.hasOwnProperty(key)){
    DeviceEventEmitter.addListener(RNFelicaEvent[key], (param) => {
      eventEmitter2.emit(RNFelicaEvent[key], param);
    });
  }
}

class JsRNFelica {
  /**
   *
   * @returns {
   *   {
   *     FELICA_DISCOVER: String,
   *     ANDROID_ON_NEW_INTENT: String,
   *     ANDROID_ON_ACTIVITY_RESULT: String,
   *     ANDROID_ON_HOST_RESUME: String,
   *     ANDROID_ON_HOST_PAUSE: String,
   *     ANDROID_ON_HOST_DESTROY: String
   *   }
   * }
   * @constructor
   */
  static get EVENT() {
    return RNFelicaEvent;
  }
  /**
   *
   * @returns {*}
   */
  static haveNfc() {
    return RNFelica.haveNfc();
  }

  /**
   *
   * @returns {*}
   */
  static enableNfc() {
    return RNFelica.enableNfc();
  }

  /**
   *
   */
  static connect() {
    return RNFelica.connect();
  }

  /**
   *
   */
  static close() {
    return RNFelica.close();
  }

  /**
   *
   * @returns {Promise}
   */
  static enableForegroundDispatch() {
    return RNFelica.enableForegroundDispatch();
  }

  /**
   *
   * @returns {Promise}
   */
  static disableForegroundDispatch() {
    return RNFelica.disableForegroundDispatch();
  }

  /**
   *
   * @param data
   * @returns {*}
   */
  static transceive(data) {
    return RNFelica.transceive(data);
  }

  /**
   *
   * @param data
   * @returns {*}
   */
  static transceiveString(data) {
    return RNFelica.transceiveString(data);
  }

  /**
   *
   * @param event
   * @param callback
   */
  static on(event, callback) {
    eventEmitter2.on(event, callback);
  }
  static off(event, callback) {
    eventEmitter2.off(event, callback);
  }
  static removeAllListeners(event) {
    eventEmitter2.removeAllListeners(event);
  }
  static onFelicaDitect(event, callback) {
    eventEmitter2.on(JsRNFelica.EVENT_FELICA_DITECT, callback);
  }
  static offFelicaDitect(event, callback) {
    eventEmitter2.off(JsRNFelica.EVENT_FELICA_DITECT, callback);
  }
  /**
   * Send Command
   * @param data
   * @returns {Promise<Array.<Number>>}
   */
  static commonSendCmd(data){
    const sendData = [...data];
    sendData.unshift(0x00);
    sendData[0] = sendData.length;
    //console.log("send data", sendData);
    return JsRNFelica.transceive(sendData)
  }

  /**
   * @typedef {Object} Polling
   * @property {Number} dataLength
   * @property {Array.<Number>} idm
   * @property {Array.<Number>} pmm
   * @property {Number} responceCode
   */
  /**
   * Polling Command
   * @param {Number} [systemCode = 0xffff] System Code
   * @param {Number} [requestCode = 0x00] Request Code
   * @param {Number} [timeSlot = 0]] Time Slot
   * @returns {Promise<Polling>}
   */
  static async polling(systemCode = 0xffff, requestCode = 0x00, timeSlot = 0) {
    const sendData = [
      FELICA_COMMAND.CC_POLLING,
      (systemCode >>> 8) & 0xFF,
      systemCode & 0xFF,
      requestCode,
      timeSlot
    ];
    try {
      const recvData = await JsRNFelica.commonSendCmd(sendData);
      const parseRecvData = {
        dataLength: recvData[0],
        responceCode: recvData[1],
        idm: recvData.slice(2, 10),
        pmm: recvData.slice(10, 18),
        requestCode: ((recvData[18] << 8) | recvData[19])
      };
      return Promise.resolve(parseRecvData);
    }catch (e) {
      return Promise.reject(new Error(e))
    }
  }

  /**
   * @typedef {Object} RequestService
   * @property {Number} dataLength
   * @property {Number} responceCode
   * @property {Array.<Number>} idm
   * @property {Number} nodeNum
   * @property {Array.<Number>} nodeKeyVerList
   */
  /**
   *
   * @param {(Array.<Number> | String)} idm
   * @param nodes
   * @returns {Promise<RequestService>}
   */
  static async requestService(idm, nodes) {
    const byteIdm = argIdm2ByteIdm(idm);
    if(byteIdm === null){
      return Promise.reject(new Error("idm is invalid"));
    }
    const sendData = [
      FELICA_COMMAND.CC_REQUEST_SERVICE,
      ...byteIdm
    ];
    sendData.push(nodes.length);
    for(const node of nodes){
      sendData.push(node & 0xFF);
      sendData.push((node >>> 8) & 0xFF);
    }
    try{
      const recvData = await JsRNFelica.commonSendCmd(sendData);
      const parseRecvData = {
        dataLength: recvData[0],
        responceCode: recvData[1],
        idm: recvData.slice(2, 10),
        nodeNum: recvData[10],
        nodeKeyVerList: []
      };
      for(let i = 0; i < parseRecvData.nodeNum; i++){
        parseRecvData.nodeKeyVerList.push((recvData[12 + i * 2] << 8) | (recvData[11 + i * 2]));
      }
      return Promise.resolve(parseRecvData);
    }catch (e) {
      return Promise.reject(new Error(e));
    }
  }
  /**
   * @typedef {Object} RequestResponse
   * @property {Number} dataLength
   * @property {Number} responceCode
   * @property {Array.<Number>} idm
   * @property {Number} mode
   */
  /**
   *
   * @param {(Array.<Number> | String)} idm
   * @returns {Promise<RequestResponse>}
   */
  static async requestResponse(idm) {
    const byteIdm = argIdm2ByteIdm(idm);
    if(byteIdm === null){
      return Promise.reject(new Error("idm is invalid"));
    }
    const sendData = [
      FELICA_COMMAND.CC_REQUEST_RESPONCE,
      ...byteIdm
    ];
    try {
      const recvData = await JsRNFelica.commonSendCmd(sendData);
      const parseRecvData = {
        dataLength: recvData[0],
        responceCode: recvData[1],
        idm: recvData.slice(2, 10),
        mode: recvData[10]
      };
      return Promise.resolve(parseRecvData);
    }catch (e) {
      return Promise.reject(new Error(e))
    }
  }

  /**
   * Make 3 Byte Block Element
   * @param {Number} accessMode - Access Code
   * @param {Number} serviceCodeIndex - Service Code Index
   * @param {Number} blockNum - block Number
   * @returns {Number} 3 Byte Block Element
   */
  static makeBlockElement(accessMode, serviceCodeIndex, blockNum){
    let data = ((accessMode << 4) | serviceCodeIndex) << 16;
    data |= blockNum;
    return data;
  }

  /**
   * @typedef {Object} ReadWithoutEncryption
   * @property {Number} dataLength
   * @property {Number} responceCode
   * @property {Array.<Number>} idm
   * @property {Number} statusFlag1
   * @property {Number} statusFlag2
   * @property {Number} blockNum
   * @property {Array.<Array.<Number>>} blockData
   */
  /**
   * Read Without Encryption Command
   * @param {(Array.<Number> | String)} idm
   * @param {Array.<Number>} [services = []] - Service List
   * @param {Array.<Number>} [blockList = []] - block List
   * @returns {Promise<ReadWithoutEncryption>}
   */
  static async readWithoutEncryption(idm, services = [], blockList = []) {
    const byteIdm = argIdm2ByteIdm(idm);
    if (byteIdm === null) {
      return Promise.reject(new Error("idm is invalid"));
    }
    const sendData = [
      FELICA_COMMAND.CC_READ_WITHOUT_ENCRYPTION,
      ...byteIdm,
    ];
    sendData.push(services.length);
    for (const service of services) {
      sendData.push(service & 0xFF);
      sendData.push((service >>> 8) & 0xFF);
    }
    sendData.push(blockList.length);
    for (const block of blockList) {
      sendData.push((block >>> 16) & 0xFF);
      sendData.push(block & 0xFF);
      sendData.push((block >>> 8) & 0xFF);
    }
    try {
      const recvData = await JsRNFelica.commonSendCmd(sendData);
      const parseRecvData = {
        dataLength: recvData[0],
        responceCode: recvData[1],
        idm: recvData.slice(2, 10),
        statusFlag1: recvData[10],
        statusFlag2: recvData[11]
      };
      if(parseRecvData.statusFlag1 === 0x00){
        parseRecvData.blockNum = recvData[12];
        parseRecvData.blockData = [];
        for(let i = 0; i < parseRecvData.blockNum; i++) {
          parseRecvData.blockData.push([]);
          for(let j = 0; j < 16; j++){
            parseRecvData.blockData[i].push(recvData[13 + 16 * i + j]);
          }
        }
      }
      return Promise.resolve(parseRecvData);
    }catch (e) {
      return Promise.reject(new Error(e))
    }
  }


  /**
   *
   * @param {(Array.<Number> | String)} idm
   * @param {Array.<Number>} services
   * @param {Array.<Number>} blockList
   * @param {Array.<Number>} blockData
   * @returns {Promise}
   */
  static writeWithoutEncryption(idm, services, blockList, blockData) {
    const byteIdm = argIdm2ByteIdm(idm);
    if(byteIdm === null){
      return Promise.reject(new Error("idm is invalid"));
    }
    const sendData = [
      FELICA_COMMAND.CC_READ_WITHOUT_ENCRYPTION,
      ...byteIdm
    ];
    sendData.push(services.length);
    for(const service of services){
      sendData.push(service & 0xFF);
      sendData.push((service >>> 8) & 0xFF);
    }
    sendData.push(blockList.length);
    for(const block of blockList){
      sendData.push(block & 0xFF);
      sendData.push((block >>> 8) & 0xFF);
      if((block & 0x1000) === 0){
        sendData.push((block >>> 16) & 0xFF);
      }
    }
    return JsRNFelica.commonSendCmd(sendData);
  }
  /**
   * @typedef {Object} SearchService
   * @property {Number} dataLength
   * @property {Number} responceCode
   * @property {Array.<Number>} idm
   * @property {Number} areaStart
   * @property {Number} areaEnd
   * @property {Number} serviceCode
   */
  /**
   *
   * @param {(Array.<Number> | String)} idm
   * @param {(Number)} idx
   * @returns {Promise<SearchService>}
   */
  static async searchService(idm, idx) {
    const byteIdm = argIdm2ByteIdm(idm);
    if(byteIdm === null){
      return Promise.reject(new Error("idm is invalid"));
    }
    const sendData = [
      FELICA_COMMAND.CC_SEARCH_SERVICE_CODE,
      ...byteIdm,
      idx & 0xFF,
      (idx >>> 8) & 0xFF
    ];
    try {
      const recvData = await JsRNFelica.commonSendCmd(sendData);
      console.log(recvData);
      const parseRecvData = {
        dataLength: recvData[0],
        responceCode: recvData[1],
        idm: recvData.slice(2, 10),
      };
      const temp = (recvData[11] << 8) | recvData[10];
      if((temp & 0x3E) === 0){
        parseRecvData.areaStart = temp;
        parseRecvData.areaEnd = (recvData[13] << 8) | recvData[12];;
      }else{
        parseRecvData.serviceCode = temp;
      }
      return Promise.resolve(parseRecvData);
    }catch (e) {
      return Promise.reject(new Error(e))
    }
  }
  /**
   * @typedef {Object} RequestSystemCode
   * @property {Number} dataLength
   * @property {Number} responceCode
   * @property {Array.<Number>} idm
   * @property {Number} systemCodeNum
   * @property {Array.<Number>} systemCodeList
   */
  /**
   * Request System System Code
   * @param {(Array.<Number> | String)} idm
   * @returns {Promise<RequestSystemCode>}
   */
  static async requestSystemCode(idm) {
    const byteIdm = argIdm2ByteIdm(idm);
    if(byteIdm === null){
      return Promise.reject(new Error("IDm is invalid"));
    }
    const sendData = [
      FELICA_COMMAND.CC_REQUEST_SYSTEM_CODE,
      ...byteIdm
    ];
    try {
      const recvData = await JsRNFelica.commonSendCmd(sendData);
      console.log(recvData)
      const parseRecvData = {
        dataLength: recvData[0],
        responceCode: recvData[1],
        idm: recvData.slice(2, 10),
        systemCodeNum: recvData[10],
        systemCodeList: []
      };
      for(let i = 0; i < parseRecvData.systemCodeNum; i++) {
        parseRecvData.systemCodeList.push((recvData[11 + i * 2] << 8) | recvData[12 + i * 2]);
      }
      return Promise.resolve(parseRecvData);
    }catch (e) {
      return Promise.reject(new Error(e))
    }
  }

  /**
   * Dump Service
   * @param {Array.<Number>} idm
   * @returns {Promise<any>}
   */
  static async dumpService(idm) {
    const byteIdm = argIdm2ByteIdm(idm);
    if(byteIdm === null){
      return Promise.reject(new Error("IDm is invalid"));
    }
    const serviceCodes = [];
    for(let i = 0; true; i++) {
      const respSs = await JsRNFelica.searchService(idm, i);
      if((respSs.serviceCode & 0xFF00) === 0xFF00){
        break;
      }
      if('serviceCode' in respSs){
        serviceCodes.push(respSs.serviceCode);
      }
    }
    const result = {};
    for(const serviceCode of serviceCodes) {
      result[serviceCode] = [];
      // check none auth
      if((serviceCode & 1) === 0) {
        continue
      }
      for(let i = 0; true; i++){
        try {
          const respRwe = await JsRNFelica.readWithoutEncryption(
            idm,
            [serviceCode],
            [JsRNFelica.makeBlockElement(0b000, 0b0000, i)]
          );
          if (0x00 !== respRwe.statusFlag1) {
            console.log("statusFlag1", respRwe.statusFlag1);
            break;
          }
          result[serviceCode].push(...respRwe.blockData);
        }catch (e) {
          console.error("dump catch", e);
          break;
        }
      }
    }
    return Promise.resolve(result);
  }
  static async analyze(customFunc = (systemCodePollingResp, result) => result) {
    try {
      // Get System Code
      const systemCodePollingResp = await JsRNFelica.polling(0xffff, 0x01);
      let result = await AnalyzeFunc(JsRNFelica, systemCodePollingResp);
      result = customFunc(systemCodePollingResp, result);
      return Promise.resolve(result);
    }catch (e) {
      return Promise.reject(e);
    }
  }
}
export default JsRNFelica;
module.exports = JsRNFelica;
