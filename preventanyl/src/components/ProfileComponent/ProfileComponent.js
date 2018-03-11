import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

export default class ProfileComponent extends Component {

  render () {
    return (
      <View>
          <Text>Profile Component</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent ('ProfileComponent', () => ProfileComponent);