import React, { Component } from 'react';
import { AppRegistry, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import DismissKeyboard from 'dismissKeyboard';

import RegisterKitForm from './RegisterKitForm';

export default class RegisterKitComponent extends Component {

  render () {
    return (
      <KeyboardAvoidingView behavior = 'padding' style = { styles.container } onPress = { () => { DismissKeyboard () } } >
        <TouchableWithoutFeedback onPress = { () => { DismissKeyboard () } }>
            <ScrollView  onPress = { () => { DismissKeyboard () } } >
                <RegisterKitForm />
            </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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