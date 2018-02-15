# react-native-felica

[![NPM](https://nodei.co/npm/react-native-felica.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-native-felica/)

## Getting started

`$ npm install react-native-felica --save`

### Mostly automatic installation

`$ react-native link react-native-felica`

### Manual installation

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNFelicaPackage;` to the imports at the top of the file
  - Add `new RNFelicaPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-felica'
  	project(':react-native-felica').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-felica/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-felica')
  	```

## Usage
```javascript
import RNFelica from 'react-native-felica';

RNFelica.on(JsRNFelica.EVENT_FELICA_DITECT, async (event) => {
    console.log("Felica Info", event);

    const pol = await RNFelica.polling();
    console.log("poll:" + RNFelica.util.byteToHexString(pol));

    const read = await RNFelica.readWithoutEncryption(event.idm, [0x090F], [0x000000]);
    console.log("read", RNFelica.util.byteToHexString(read));

    const reqSysCode = await RNFelica.requestSystemCode(event.idm);
    console.log("connect ", reqSysCode);
});
```
