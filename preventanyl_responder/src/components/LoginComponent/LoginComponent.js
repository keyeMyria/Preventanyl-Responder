import React, { Component } from 'react';
import { AppRegistry, Text, View, Image, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import DismissKeyboard from 'dismissKeyboard';

import LoginForm from './LoginForm';

export default class LoginComponent extends Component {

    render () {
        const { navigate } = this.props.navigation;

        return (
            <KeyboardAvoidingView behavior = 'padding' style = { styles.container }>

                <TouchableWithoutFeedback onPress = { () => { DismissKeyboard() } }>
                    <View style = { styles.logoContainer }>
                        <Image 
                            style = { styles.logo }
                            source = { require ('../../../assets/images/logo/app-store.png') } />
                            <Text style = { styles.title }>An app designed to help reduce the number of overdose fatalities</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress = { () => { DismissKeyboard() } }>
                    <View style = { styles.formContainer }>
                        <LoginForm />
                    </View>
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
    logoContainer : {
        alignItems : 'center',
        flexGrow : 1,
        justifyContent : 'center'
    },
      logo : {
          width : 100,
          height : 100
    },
    title : {
      color : '#FFF',
      marginTop : 10,
      width : 160,
      textAlign : 'center',
      opacity : 0.9
    }
});

AppRegistry.registerComponent ('LoginComponent', () => LoginComponent);