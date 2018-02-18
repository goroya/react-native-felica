/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import styles from "./styles";
import {
  Container, Header, Title, Text, List, ListItem, Card, CardItem, View, Body
} from 'native-base';
import RNFelica from 'react-native-felica';

RNFelica.on(RNFelica.EVENT.ANDROID_ON_HOST_RESUME, async () => {
  console.log("EVENT ANDROID_ON_HOST_RESUME");
  await RNFelica.enableForegroundDispatch().catch(err => {
    console.info(err);
  })
});
RNFelica.on(RNFelica.EVENT.ANDROID_ON_HOST_PAUSE, async () => {
  console.log("EVENT ANDROID_ON_HOST_PAUSE");
  await RNFelica.disableForegroundDispatch().catch(err => {
    console.info(err);
  })
});

let startupFelicaInfo = null;

async function startupFelicaCb(event) {
  console.log("Startup FELICA_DISCOVER", event);
  startupFelicaInfo = event;
}

RNFelica.on(RNFelica.EVENT.FELICA_DISCOVER, startupFelicaCb);

function bytes2hexString(bytes) {
  return bytes.map((val) => {
    return ("00" + val.toString(16)).slice(-2);
  }).join(" ");
}

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      idm: "",
      pmm: ""
    };
  }

  async updateFelicaView(info) {
    this.setState({
      idm: bytes2hexString(info.idm),
      pmm: bytes2hexString(info.pmm),
      type: "",
      info: {}
    });
    await RNFelica.connect();
    const anaResult = await RNFelica.analyze();
    this.setState({
      type: anaResult.type,
      history: anaResult.history
    });
    await RNFelica.close();
  }

  componentDidMount() {
    if (startupFelicaInfo !== null) {
      RNFelica.off(RNFelica.EVENT.FELICA_DISCOVER, startupFelicaCb);
      this.updateFelicaView(startupFelicaInfo);
    }
    RNFelica.on(RNFelica.EVENT.FELICA_DISCOVER, async (event) => {
      console.log("FELICA_DISCOVER");
      await this.updateFelicaView(event);
    });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    let CardView = (<Text style={styles.noneText}>カード情報</Text>);
    if (this.state.type === "CJRC") {
      CardView = (
        <List dataArray={this.state.history}
              renderRow={(item) => {
                return (
                  <ListItem>
                    <View>
                      <Text>{item.date.yy}/{item.date.mm}/{item.date.dd}</Text>
                      <Text>入場駅コード: {item.enterStationCode}</Text>
                      <Text>退場駅コード: {item.exitStationCode}</Text>
                      <Text>残高 {item.balance}円</Text>
                    </View>
                  </ListItem>
                );
              }}
        >
        </List>
      );
    } else if (this.state.type === "Kururu") {
      CardView = (
        <List dataArray={this.state.history}
              renderRow={(item) => {
                return (
                  <ListItem>
                    <View>
                      <Text>{item.date.yy}/{item.date.mm}/{item.date.dd}</Text>
                      <Text>入場駅: {item.enterStationName}</Text>
                      <Text>降車駅: {item.exitStationName}</Text>
                      <Text>乗車時刻: {item.enterTime.hour}:{item.enterTime.min}</Text>
                      <Text>降車時刻: {item.exitTime.hour}:{item.exitTime.min}</Text>
                      <Text>残高 {item.balance}円</Text>
                    </View>
                  </ListItem>
                );
              }}
        >
        </List>
      );
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Body>
          <Title>Felica Reader</Title>
          </Body>
        </Header>
        <List>
          <ListItem>
            <Text>IDM: {this.state.idm}</Text>
          </ListItem>
          <ListItem>
            <Text>PMM: {this.state.pmm}</Text>
          </ListItem>
          <ListItem>
            <Text>カードの種類: {this.state.type}</Text>
          </ListItem>
        </List>
        {CardView}
      </Container>
    );
  }
}
