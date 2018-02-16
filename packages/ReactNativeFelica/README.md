# react-native-felica

[![NPM](https://nodei.co/npm/react-native-felica.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-native-felica/)

## Getting started

`$ npm install react-native-felica --save`

### Mostly automatic installation

`$ react-native link react-native-felica`

## ESDoc Docment
ESdoc Document is bellow
https://goroya.github.io/react-native-felica/

# API Docment
## Usage
```js
// Require the module
import RNFelica from 'react-native-felica';
RNFelica.on(RNFelica.EVENT.FELICA_DISCOVER, async (event) => {
    // Check having NFC equipment
    await RNFelica.haveNfc()

    // Check enabling NFC
    await RNFelica.enableNfc()

    // Connecting Felica
    await RNFelica.connect()

    // Disconnect Felica
    await RNFelica.close()

    // 
    await RNFelica.enableForegroundDispatch()

    // 
    await RNFelica.disableForegroundDispatch()

    // Send Raw data to Felica
    await RNFelica.transceive(data)

}
```

## Usage
```javascript
import RNFelica from 'react-native-felica';

RNFelica.on(RNFelica.EVENT.FELICA_DISCOVER, async (event) => {
    console.log("Felica Info", event);

    const pol = await RNFelica.polling();
    console.log("poll:" + RNFelica.util.byteToHexString(pol));

    const read = await RNFelica.readWithoutEncryption(event.idm, [0x090F], [0x000000]);
    console.log("read", RNFelica.util.byteToHexString(read));

    const reqSysCode = await RNFelica.requestSystemCode(event.idm);
    console.log("connect ", reqSysCode);
});
```
