import React, {Component} from 'react';
import styles from "./styles";
import {
  Container, Header, Title, Text, List, ListItem, Card, CardItem, View, Body
} from 'native-base';
import RNFelica from 'react-native-felica';
import RNAndroidLifeCycle from 'react-native-android-lifecycle';

RNAndroidLifeCycle.on(RNAndroidLifeCycle.EVENT.ON_HOST_RESUME, async () => {
  console.log("EVENT ANDROID_ON_HOST_RESUME");
  await RNFelica.enableForegroundDispatch().catch(err => {
    console.info(err);
  })
});
RNAndroidLifeCycle.on(RNAndroidLifeCycle.EVENT.ON_HOST_PAUSE, async () => {
  console.log("EVENT ANDROID_ON_HOST_PAUSE");
  await RNFelica.disableForegroundDispatch().catch(err => {
    console.info(err);
  })
});
console.log(RNFelica);
let startupFelicaInfo = null;

async function startupFelicaCb(event) {
  console.log("Startup FELICA_DISCOVER", event);
  startupFelicaInfo = event;
}

RNFelica.on(RNFelica.EVENT.FELICA_DISCOVER, startupFelicaCb);

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      idm: "",
      pmm: ""
    };
  }

  componentDidMount() {
    if (startupFelicaInfo !== null) {
      RNFelica.off(RNFelica.EVENT.FELICA_DISCOVER, startupFelicaCb);
    }
    RNFelica.on(RNFelica.EVENT.FELICA_DISCOVER, async (event) => {
      console.log("FELICA_DISCOVER", event);
      try{
        await RNFelica.connect();
        const polling = await RNFelica.polling(0xFFFF, 0x01, 0);
        console.log("0 polling", polling);
        const requestService = await RNFelica.requestService(event.idm, [0x000F]);
        console.log("1 requestService", requestService);
        const requestResponse = await RNFelica.requestResponse(event.idm);
        console.log("2 requestResponse", requestResponse);
        const readWithoutEncryption = await RNFelica.readWithoutEncryption(event.idm, [0x000F], [0, 0], [0, 1]);
        console.log("3 readWithoutEncryption", readWithoutEncryption);
        const searchServiceCode = await RNFelica.searchServiceCode(event.idm, 0);
        console.log("4 searchServiceCode", searchServiceCode);
        const requestSystemCode = await RNFelica.requestSystemCode(event.idm);
        console.log("5 requestSystemCode", requestSystemCode);

        await RNFelica.close();
      }catch(e){
        console.error("error", e);
      }
    });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Body>
          <Title>Felica Reader</Title>
          </Body>
        </Header>
      </Container>
    );
  }
}
