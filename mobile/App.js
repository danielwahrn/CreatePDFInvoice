import React from 'react';
import { View } from 'react-native';
import { AppContainer } from './src/Navigator';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <AppContainer />
      </View>
    )
  }
}