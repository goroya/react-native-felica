import {EventEmitter2} from "eventemitter2";
import FelicaParser, {
    IRCPolling,
    IRCReadWithoutEncryption,
    IRCRequestResponce, IRCRequestService, IRCRequestSystemCode, IRCSearchServiceCode,
    IRCWriteWithoutEncryption,
} from "felica-parser";
import {DeviceEventEmitter, NativeModules} from "react-native";

const {RNFelica} = NativeModules;

/**
 * Felica Event
 */
export interface IRNFelicaEvent {
    FELICA_DISCOVER: string;
}

export class JSRNFelica extends EventEmitter2 {
    /**
     * Send data to Felica
     * @param {number[]} data
     * @returns {Promise<number[]>}
     */
    private static commonSendCmd(data: number[]): Promise<number[]> {
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
    private static parseRecvData(data: number[]) {
        return FelicaParser.parseResponse(data.slice(1));
    }

    /**
     * Get Library Event
     * @type {{FELICA_DISCOVER: string}}
     */
    public EVENT: IRNFelicaEvent = {
        FELICA_DISCOVER: RNFelica.EVENT.FELICA_DISCOVER,
    };

    /**
     * Constructor
     */
    constructor() {
        super();
        DeviceEventEmitter.addListener(this.EVENT.FELICA_DISCOVER, (param) => {
            this.emit(this.EVENT.FELICA_DISCOVER, param);
        });
    }

    /**
     * Check having NFC
     * @returns {Promise<null>}
     */
    public haveNfc(): Promise<null> {
        return RNFelica.haveNfc();
    }

    /**
     * Check Enabling NFC
     * @returns {Promise<null>}
     */
    public enableNfc(): Promise<null> {
        return RNFelica.enableNfc();
    }

    /**
     * Connect to Felica
     * @returns {Promise<null>}
     */
    public connect(): Promise<null> {
        return RNFelica.connect();
    }

    /**
     * Close Felica
     * @returns {Promise<null>}
     */
    public close(): Promise<null> {
        return RNFelica.close();
    }

    /**
     * [Android API] enableForegroundDispatch
     * @returns {Promise<null>}
     */
    public enableForegroundDispatch(): Promise<null> {
        return RNFelica.enableForegroundDispatch();
    }

    /**
     * [Android API] disableForegroundDispatch
     * @returns {Promise<null>}
     */
    public disableForegroundDispatch(): Promise<null> {
        return RNFelica.disableForegroundDispatch();
    }

    /**
     * [Android API] transceive
     * @param {number[]} data
     * @returns {Promise<number[]>}
     */
    public transceive(data: number[]): Promise<number[]> {
        return RNFelica.transceive(data);
    }

    /**
     * [Android API] transceive(string data version)
     * @param {string} data
     * @returns {Promise<string>}
     */
    public transceiveString(data: string): Promise<string> {
        return RNFelica.transceiveString(data);
    }

    /**
     * Felica Polling Command
     * @param {number} systemCode
     * @param {number} requestCode
     * @param {number} timeSlot
     * @returns {Promise<IRCPolling>}
     */
    public async polling(systemCode = 0xffff, requestCode = 0x00, timeSlot = 0): Promise<any> {
        const sendData = FelicaParser.polling(systemCode, requestCode, timeSlot);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    /**
     * Felica RequestService Command
     * @param {number[] | string} idm
     * @param {number[]} nodes
     * @returns {Promise<IRCPolling>}
     */
    public async requestService(idm: number[] | string, nodes: number[]): Promise<any> {
        const sendData = FelicaParser.requestService(idm, nodes);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    /**
     * Felica RequestResponse Command
     * @param {number[] | string} idm
     * @returns {Promise<IRCRequestResponce>}
     */
    public async requestResponse(idm: number[] | string): Promise<any> {
        const sendData = FelicaParser.requestResponse(idm);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    /**
     * Felica ReadWithoutEncryption Command
     * @param {number[] | string} idm
     * @param {number[]} services
     * @param {number[]} serviceCodeListOrderList
     * @param {number[]} blockNumberList
     * @returns {Promise<IRCReadWithoutEncryption>}
     */
    public async readWithoutEncryption(
        idm: number[] | string, services: number[],
        serviceCodeListOrderList: number[], blockNumberList: number[]): Promise<any> {
        const sendData = FelicaParser.readWithoutEncryption(idm, services, serviceCodeListOrderList, blockNumberList);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
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
    public async writeWithoutEncryption(
        idm: number[], services: number[], serviceCodeListOrderList: number[],
        blockNumberList: number[], blockData: number[][]): Promise<any> {
        const sendData = FelicaParser.writeWithoutEncryption(
            idm, services, serviceCodeListOrderList, blockNumberList, blockData);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    /**
     * Felica SearchServiceCode Command
     * @param {number[] | string} idm
     * @param {number} idx
     * @returns {Promise<IRCSearchServiceCode>}
     */
    public async searchServiceCode(idm: number[] | string, idx: number): Promise<any> {
        const sendData = FelicaParser.searchServiceCode(idm, idx);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }

    /**
     * Felica requestSystemCode Command
     * @param {number[] | string} idm
     * @returns {Promise<IRCRequestSystemCode>}
     */
    public async requestSystemCode(idm: number[] | string): Promise<any> {
        const sendData = FelicaParser.requestSystemCode(idm);
        try {
            const recvData: number[] = await JSRNFelica.commonSendCmd(sendData);
            const parseRecvData = JSRNFelica.parseRecvData(recvData);
            return Promise.resolve(parseRecvData);
        } catch (e) {
            return Promise.reject(new Error(e));
        }
    }
}

/**
 * Make JSRNFelica class instance
 * @returns {JSRNFelica}
 */
function createInstance(): JSRNFelica {
    return new JSRNFelica();
}

const jsRNFelica: JSRNFelica = createInstance();
export default jsRNFelica;
