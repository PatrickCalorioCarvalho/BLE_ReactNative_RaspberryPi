/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import HomePage from './HomePage';

function App() {
  return (
    <View style={{flex: 1}}>
      <HomePage />
      <FlashMessage position="bottom" />
    </View>
  );
}
export default App;
