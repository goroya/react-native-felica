"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const felica_parser_1 = __importDefault(require("felica-parser"));
const react_native_1 = require("react-native");
const { RNFelica } = react_native_1.NativeModules;
class JSRNFelica extends eventemitter2_1.EventEmitter2 {
    /**
     * Constructor
     */
    constructor() {
        super();
        /**
         * Get Library Event
         * @type {{FELICA_DISCOVER: string}}
         */
        this.EVENT = {
            FELICA_DISCOVER: RNFelica.EVENT.FELICA_DISCOVER,
        };
        react_native_1.DeviceEventEmitter.addListener(this.EVENT.FELICA_DISCOVER, (param) => {
            this.emit(this.EVENT.FELICA_DISCOVER, param);
        });
    }
    /**
     * Send data to Felica
     * @param {number[]} data
     * @returns {Promise<number[]>}
     */
    static commonSendCmd(data) {
        const sendData = [...data];
        sendData.unshift(0x00);
        sendData[0] = sendData.length;
        return RNFelica.transceive(sendData);
    }
    /**
     * Parse Receiving data
     * @param {number[]} data
     * @returns {IRCPolling | IRCRequestService | IRCRequestResponce | IRCReadWithoutEncryption |
     * IRCWriteWithoutEncryption| IRCSearchServiceCode | IRCRequestSystemCode}
     */
    static parseRecvData(data) {
        console.log("parseRecvData", data);
        return felica_parser_1.default.parseResponse(data.slice(1));
    }
    /**
     * Check having NFC
     * @returns {Promise<null>}
     */
    haveNfc() {
        return RNFelica.haveNfc();
    }
    /**
     * Check Enabling NFC
     * @returns {Promise<null>}
     */
    enableNfc() {
        return RNFelica.enableNfc();
    }
    /**
     * Connect to Felica
     * @returns {Promise<null>}
     */
    connect() {
        return RNFelica.connect();
    }
    /**
     * Close Felica
     * @returns {Promise<null>}
     */
    close() {
        return RNFelica.close();
    }
    /**
     * [Android API] enableForegroundDispatch
     * @returns {Promise<null>}
     */
    enableForegroundDispatch() {
        return RNFelica.enableForegroundDispatch();
    }
    /**
     * [Android API] disableForegroundDispatch
     * @returns {Promise<null>}
     */
    disableForegroundDispatch() {
        return RNFelica.disableForegroundDispatch();
    }
    /**
     * [Android API] transceive
     * @param {number[]} data
     * @returns {Promise<number[]>}
     */
    transceive(data) {
        return RNFelica.transceive(data);
    }
    /**
     * [Android API] transceive(string data version)
     * @param {string} data
     * @returns {Promise<string>}
     */
    transceiveString(data) {
        return RNFelica.transceiveString(data);
    }
    /**
     * Felica Polling Command
     * @param {number} systemCode
     * @param {number} requestCode
     * @param {number} timeSlot
     * @returns {Promise<IRCPolling>}
     */
    polling(systemCode = 0xffff, requestCode = 0x00, timeSlot = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.polling(systemCode, requestCode, timeSlot);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
    /**
     * Felica RequestService Command
     * @param {number[] | string} idm
     * @param {number[]} nodes
     * @returns {Promise<IRCPolling>}
     */
    requestService(idm, nodes) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.requestService(idm, nodes);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
    /**
     * Felica RequestResponse Command
     * @param {number[] | string} idm
     * @returns {Promise<IRCRequestResponce>}
     */
    requestResponse(idm) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.requestResponse(idm);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
    /**
     * Felica ReadWithoutEncryption Command
     * @param {number[] | string} idm
     * @param {number[]} services
     * @param {number[]} serviceCodeListOrderList
     * @param {number[]} blockNumberList
     * @returns {Promise<IRCReadWithoutEncryption>}
     */
    readWithoutEncryption(idm, services, serviceCodeListOrderList, blockNumberList) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.readWithoutEncryption(idm, services, serviceCodeListOrderList, blockNumberList);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
    /**
     * Felica WriteWithoutEncryption Command
     * @param {number[]} idm
     * @param {number[]} services
     * @param {number[]} serviceCodeListOrderList
     * @param {number[]} blockNumberList
     * @param {number[][]} blockData
     * @returns {Promise<IRCWriteWithoutEncryption>}
     */
    writeWithoutEncryption(idm, services, serviceCodeListOrderList, blockNumberList, blockData) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.writeWithoutEncryption(idm, services, serviceCodeListOrderList, blockNumberList, blockData);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
    /**
     * Felica SearchServiceCode Command
     * @param {number[] | string} idm
     * @param {number} idx
     * @returns {Promise<IRCSearchServiceCode>}
     */
    searchServiceCode(idm, idx) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.searchServiceCode(idm, idx);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
    /**
     * Felica requestSystemCode Command
     * @param {number[] | string} idm
     * @returns {Promise<IRCRequestSystemCode>}
     */
    requestSystemCode(idm) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendData = felica_parser_1.default.requestSystemCode(idm);
            try {
                const recvData = yield JSRNFelica.commonSendCmd(sendData);
                const parseRecvData = JSRNFelica.parseRecvData(recvData);
                return Promise.resolve(parseRecvData);
            }
            catch (e) {
                return Promise.reject(new Error(e));
            }
        });
    }
}
exports.JSRNFelica = JSRNFelica;
/**
 * Make JSRNFelica class instance
 * @returns {JSRNFelica}
 */
function createInstance() {
    return new JSRNFelica();
}
const jsRNFelica = createInstance();
exports.default = jsRNFelica;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaURBQTRDO0FBQzVDLGtFQUt1QjtBQUN2QiwrQ0FBK0Q7QUFFL0QsTUFBTSxFQUFDLFFBQVEsRUFBQyxHQUFHLDRCQUFhLENBQUM7QUFTakMsZ0JBQXdCLFNBQVEsNkJBQWE7SUFnQ3pDOztPQUVHO0lBQ0g7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQVpaOzs7V0FHRztRQUNJLFVBQUssR0FBbUI7WUFDM0IsZUFBZSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZTtTQUNsRCxDQUFDO1FBT0UsaUNBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDakUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUF2Q0Q7Ozs7T0FJRztJQUNLLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBYztRQUN2QyxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDM0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQWM7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLHVCQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxL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