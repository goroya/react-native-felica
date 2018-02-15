import pluginList from './plugin';

async function analyze(JsRNFelica, systemCodePollingResp){
  try {
    let result = null;
    const {requestCode: systemCode} = systemCodePollingResp;
    const systemCodeStr = ('0000' + systemCode.toString(16)).slice(-4).toUpperCase();
    if(undefined !== pluginList[systemCodeStr]){
      result = await pluginList[systemCodeStr].cb(JsRNFelica, systemCodePollingResp);
      console.log(result);
    }
    return result;
  }catch (e) {
    return Promise.reject(e)
  }
}
export default analyze;
module.exports = analyze;
