import React, { Component } from 'react';
import { AppRegistry, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import DismissKeyboard from 'dismissKeyboard';

export default class SupportUsComponent extends Component {

  render () {
    return (
        <View style = { styles.container } >
            <Text>SupportUsComponent</Text>
        </View>
    );
  }

}

const styles = StyleSheet.create ({
  container : {
      flex : 1,
      backgroundColor : '#3498db'
  },
  title : {
    color : '#FFF',
    marginTop : 10,
    width : 160,
    textAlign : 'center',
    opacity : 0.9
  }
});

AppRegistry.registerComponent ('RegisterKitComponent', () => RegisterKitComponent);