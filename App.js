/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import Datum from 'datum-sdk';
import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';

const PASSWORD = 'password';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.datum = new Datum();
    this.state = {
      address: 'n/a',
      balance: 'n/a'
    }
    this.getBalance = this.getBalance.bind(this);
    this.init = this.init.bind(this);
  }

  componentWillMount() {
    this.init();
  }

  async init() {
    let obj = await Datum.createIdentity(PASSWORD);
    this.datum.initialize({
      identity: obj.keystore
    });
    this.datum.identity.storePassword(PASSWORD);
    this.setState({address: this.datum.identity.address});
    console.log('init done');
  }

  async getBalance() {
    let networkBalance = await Datum.getBalance(this.state.address);
    this.setState(() => {
      return { balance: networkBalance }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Getting Started with the Datum SDK!</Text>
        <Text style={styles.instructions}>Your wallet address is: {this.state.address}</Text>
        <Text style={styles.instructions}>Balance is: {this.state.balance}</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button
          onPress = { this.getBalance }
          title='Refresh Balance'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
