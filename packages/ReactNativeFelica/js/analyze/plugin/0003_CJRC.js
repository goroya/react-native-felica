const pluginCJRC = {
  kind: "CJRC",
  cb: async (rnFelica, systemCodePollingResp) => {
    try {
      const {idm} = systemCodePollingResp;
      const result = {
        type: "CJRC",
      };
      // 0x008B
      const readResp = await rnFelica.readWithoutEncryption(idm, [0x008B], [rnFelica.makeBlockElement(0, 0, 0)]);
      const {blockData, statusFlag1} = readResp;
      if(statusFlag1 !== 0){
        throw new Error(`statusFlag1 is ${statusFlag1}`);
      }
      result.rawData = blockData;
      result.cardType = (blockData[0][8] & 0xF0) >>> 4;
      result.finalSettlementAreaCode = blockData[0][8] & 0x0F;
      result.cardBalance = (blockData[0][12] << 8) | blockData[0][11];
      result.updateNumber = (blockData[0][15] << 8) | blockData[0][14];
      // 0x090F
      result.history = [];
      for(let i = 0; i < 20; i++){
        const readResp = await rnFelica.readWithoutEncryption(idm, [0x090F], [rnFelica.makeBlockElement(0, 0, i)]);
        const {blockData} = readResp;
        const oneBlockData = blockData[0];
        result.history.push({
          rawData: oneBlockData,
          deviceType: oneBlockData[0],
          usageType: oneBlockData[1],
          settlementType: oneBlockData[2],
          entranceType: oneBlockData[3],
          data: {
            yy: oneBlockData[4] >>> 1,
            mm: ((oneBlockData[4] & 0x01) << 3) | (oneBlockData[5] >>> 5),
            dd: oneBlockData[5] & 0x1F,
          },
          enterStationCode: (oneBlockData[6] << 8) | oneBlockData[7],
          exitStationCode:  (oneBlockData[8] << 8) |  oneBlockData[9],
          balance: (oneBlockData[11] << 8)| oneBlockData[10],
          historyNumber:  (oneBlockData[13] << 8) |  oneBlockData[14],
          regionCode: {
            enterAreaCode: (oneBlockData[15] & 0xC0) >>> 6,
            exitAreaCode: (oneBlockData[15] & 0x30) >>> 4,
          }
        })
      }
      return Promise.resolve(result);
    }catch (e) {
      console.log("ew", e);
      return Promise.reject(e);
    }
  }
};
export default pluginCJRC;
module.exports = pluginCJRC;
