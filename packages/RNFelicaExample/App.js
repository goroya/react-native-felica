/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';
import styles from "./styles";
import {
  Container, Header, Title, Content, Footer, FooterTab,
  Button, Left, Right, Body, Icon, Text,
  List, ListItem,
  Card, CardItem,
  View
} from 'native-base';
import RNFelica from 'react-native-felica';
import JsRNFelica from "../ReactNativeFelica/js/JsRNFelica";

RNFelica.on(JsRNFelica.EVENT.ANDROID_ON_HOST_RESUME, async () => {
  console.log("EVENT ANDROID_ON_HOST_RESUME");
  await JsRNFelica.enableForegroundDispatch().catch(err => { console.info(err); })
});
RNFelica.on(JsRNFelica.EVENT.ANDROID_ON_HOST_PAUSE, async () => {
  console.log("EVENT ANDROID_ON_HOST_PAUSE");
  await JsRNFelica.disableForegroundDispatch().catch(err => { console.info(err); })
});

let startupFelicaInfo = null;
async function startupFelicaCb(event){
  console.log("Startup FELICA_DISCOVER", event);
  startupFelicaInfo = event;
}
RNFelica.on(JsRNFelica.EVENT.FELICA_DISCOVER, startupFelicaCb);

function bytes2hexString(bytes) {
  return bytes.map((val) => {
    return ("00" + val.toString(16)).slice(-2);
  }).join(" ");
}
export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    if(startupFelicaInfo !== null){
      RNFelica.off(JsRNFelica.EVENT.FELICA_DISCOVER, startupFelicaCb);
      this.updateFelicaView(startupFelicaInfo);
    }
  }
  updateFelicaView(info) {
    this.state = {
      idm: bytes2hexString(info.idm),
      pmm: bytes2hexString(info.pmm)
    };
  }
  componentDidMount() {
    RNFelica.on(JsRNFelica.EVENT.FELICA_DISCOVER, async (event) => {
      console.log("FELICA_DISCOVER");
      updateFelicaView(event);
      await RNFelica.connect();
      const pol = await RNFelica.polling(0xffff, 0x00);
      console.log("poll:", pol);
      const anaResult = await RNFelica.analyze();
      console.log("anaResult", anaResult);
      await RNFelica.close();
    });
  }
  componentWillUnmount(){
    console.log("componentWillUnmount");
  }
  render() {
    const cc = 100;
    return (
      <Container style={styles.container}>
        <Header>
          <Body>
          <Title>Felica Reader</Title>
          </Body>
        </Header>
        <List>
          <ListItem itemHeader first>
            <Text>基本情報</Text>
          </ListItem>
        </List>
        <ScrollView>
          <Card>
            <CardItem>
              <Text style={{fontSize:96}}>Scroll me plz1a</Text>
            </CardItem>
          </Card>
          <Text style={{fontSize:96}}>Scroll me plz1a</Text>
          <Text style={{fontSize:96}}>Scroll me plz2</Text>
          <Text style={{fontSize:96}}>Scroll me plz3</Text>
          <Text style={{fontSize:96}}>Scroll me plz4</Text>
          <Text style={{fontSize:96}}>Scroll me plz5</Text>
          <Text style={{fontSize:96}}>Scroll me plz6</Text>
          <Text style={{fontSize:96}}>Scroll me plz6</Text>
        </ScrollView>
      </Container>
    );
  }
}
