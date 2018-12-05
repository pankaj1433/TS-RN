import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

import Store from './src/store/index';

import AppEntry from './src/index';

export default class App extends React.Component {

  render() {
    let store = Store;
    return (
      <Provider store = {store}>
        <AppEntry />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
