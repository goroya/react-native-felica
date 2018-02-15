import kururuCode from './stationCode/kururu';

function deviceType2ja(data) {
  let result = `不明 (${data})`;
  switch (data) {
    case 0b0101:
      result = '車内';
      break;
    case 0b0111:
      result = '営業所';
      break;
    case 0b1110:
      result = '券売機';
      break;
  }
  return result;
}
function kind2ja(data){
  let result = `不明 (${data})`;
  switch (data) {
    case 0b0000:
      result = '入金';
      break;
    case 0b0010:
      result = '支払';
      break;
  }
  return result;
}
function company2ja(data){
  let result = `不明 (${data})`;
  switch (data) {
    case 0b0001:
      result = '長電バス';
      break;
    case 0b0011:
      result = 'アルピコバス';
      break;
    case 0b0101:
      result = '長野市営バス';
      break;
    case 0b0111:
      result = '長野市乗合バス';
      break;
  }
  return result;
}
function discount2ja(data){
  let result = `不明 (${data})`;
  switch (data) {
    case 0b0000:
      result = '入金';
      break;
    case 0b0001:
      result = 'なし';
      break;
  }
  return result;
}

const pluginKururu = {
  kind: "CJRC",
  cb: async (rnFelica, systemCodePollingResp) => {
    try {
      const {idm} = systemCodePollingResp;
      const result = {};
      // 0x000F
      result.history = [];
      for (let i = 0; i < 10; i++) {
        const readResp = await rnFelica.readWithoutEncryption(idm, [0x000F], [rnFelica.makeBlockElement(0, 0, i)]);
        const {blockData} = readResp;
        const oneBlockData = blockData[0];
        result.history.push({
          rawData: oneBlockData,
          //
          type: "Kururu",
          // 年月日
          data: {
            year: oneBlockData[0] >>> 1,
            month: ((oneBlockData[0] & 0x01) << 3) | (oneBlockData[1] >>> 5),
            day: oneBlockData[1] & 0x1F,
          },
          // 降車時刻
          exitTime: {
            hour: Math.floor(oneBlockData[2] * 10 / 60),
            min: oneBlockData[2] * 10 % 60
          },
          // 乗車時刻
          enterTime: {
            hour: Math.floor(oneBlockData[5] * 10 / 60),
            min: oneBlockData[5] * 10 % 60
          },
          // 乗車停留所
          enterStationCode: (oneBlockData[6] << 8) | oneBlockData[7],
          // 降車停留所
          exitStationCode: (oneBlockData[8] << 8) | oneBlockData[9],
          // 券売機種別
          deviceType: (oneBlockData[10] & 0xF0) >>> 4,
          // 種別
          kind: oneBlockData[10] & 0x0F,
          // 会社コード
          companyCode: oneBlockData[11] >>> 4,
          // 割引
          discount: oneBlockData[11] & 0x0F,
          // 残高
          balance: (oneBlockData[12] << 24) | (oneBlockData[13] << 16) | (oneBlockData[14] << 8) | oneBlockData[15]
        });
        const tailResult = result.history[result.history.length - 1];
        tailResult.deviceTypeJa = deviceType2ja(tailResult.deviceType);
        tailResult.kindJa = kind2ja(tailResult.kind);
        tailResult.companyCodeJa = company2ja(tailResult.companyCode);
        tailResult.discountJa = discount2ja(tailResult.discount);
        tailResult.enterStationName = kururuCode[tailResult.enterStationCode] ? kururuCode[tailResult.enterStationCode].name: '不明';
        tailResult.exitStationName = kururuCode[tailResult.exitStationCode] ? kururuCode[tailResult.exitStationCode].name : '不明';
      }
      console.log("result", result);
      return Promise.resolve(result);
    } catch (e) {
      console.log("ew", e);
      return Promise.reject(e);
    }
  }
};
export default pluginKururu;
module.exports = pluginKururu;
