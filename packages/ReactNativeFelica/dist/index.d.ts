import { EventEmitter2 } from "eventemitter2";
/**
 * Felica Event
 */
export interface IRNFelicaEvent {
    FELICA_DISCOVER: string;
}
export declare class JSRNFelica extends EventEmitter2 {
    /**
     * Send data to Felica
     * @param {number[]} data
     * @returns {Promise<number[]>}
     */
    private static commonSendCmd(data);
    /**
     * Parse Receiving data
     * @param {number[]} data
     * @returns {IRCPolling | IRCRequestService | IRCRequestResponce | IRCReadWithoutEncryption |
     * IRCWriteWithoutEncryption| IRCSearchServiceCode | IRCRequestSystemCode}
     */
    private static parseRecvData(data);
    /**
     * Get Library Event
     * @type {{FELICA_DISCOVER: string}}
     */
    EVENT: IRNFelicaEvent;
    /**
     * Constructor
     */
    constructor();
    /**
     * Check having NFC
     * @returns {Promise<null>}
     */
    haveNfc(): Promise<null>;
    /**
     * Check Enabling NFC
     * @returns {Promise<null>}
     */
    enableNfc(): Promise<null>;
    /**
     * Connect to Felica
     * @returns {Promise<null>}
     */
    connect(): Promise<null>;
    /**
     * Close Felica
     * @returns {Promise<null>}
     */
    close(): Promise<null>;
    /**
     * [Android API] enableForegroundDispatch
     * @returns {Promise<null>}
     */
    enableForegroundDispatch(): Promise<null>;
    /**
     * [Android API] disableForegroundDispatch
     * @returns {Promise<null>}
     */
    disableForegroundDispatch(): Promise<null>;
    /**
     * [Android API] transceive
     * @param {number[]} data
     * @returns {Promise<number[]>}
     */
    transceive(data: number[]): Promise<number[]>;
    /**
     * [Android API] transceive(string data version)
     * @param {string} data
     * @returns {Promise<string>}
     */
    transceiveString(data: string): Promise<string>;
    /**
     * Felica Polling Command
     * @param {number} systemCode
     * @param {number} requestCode
     * @param {number} timeSlot
     * @returns {Promise<IRCPolling>}
     */
    polling(systemCode?: number, requestCode?: number, timeSlot?: number): Promise<any>;
    /**
     * Felica RequestService Command
     * @param {number[] | string} idm
     * @param {number[]} nodes
     * @returns {Promise<IRCPolling>}
     */
    requestService(idm: number[] | string, nodes: number[]): Promise<any>;
    /**
     * Felica RequestResponse Command
     * @param {number[] | string} idm
     * @returns {Promise<IRCRequestResponce>}
     */
    requestResponse(idm: number[] | string): Promise<any>;
    /**
     * Felica ReadWithoutEncryption Command
     * @param {number[] | string} idm
     * @param {number[]} services
     * @param {number[]} serviceCodeListOrderList
     * @param {number[]} blockNumberList
     * @returns {Promise<IRCReadWithoutEncryption>}
     */
    readWithoutEncryption(idm: number[] | string, services: number[], serviceCodeListOrderList: number[], blockNumberList: number[]): Promise<any>;
    /**
     * Felica WriteWithoutEncryption Command
     * @param {number[]} idm
     * @param {number[]} services
     * @param {number[]} serviceCodeListOrderList
     * @param {number[]} blockNumberList
     * @param {number[][]} blockData
     * @returns {Promise<IRCWriteWithoutEncryption>}
     */
    writeWithoutEncryption(idm: number[], services: number[], serviceCodeListOrderList: number[], blockNumberList: number[], blockData: number[][]): Promise<any>;
    /**
     * Felica SearchServiceCode Command
     * @param {number[] | string} idm
     * @param {number} idx
     * @returns {Promise<IRCSearchServiceCode>}
     */
    searchServiceCode(idm: number[] | string, idx: number): Promise<any>;
    /**
     * Felica requestSystemCode Command
     * @param {number[] | string} idm
     * @returns {Promise<IRCRequestSystemCode>}
     */
    requestSystemCode(idm: number[] | string): Promise<any>;
}
declare const jsRNFelica: JSRNFelica;
export default jsRNFelica;
