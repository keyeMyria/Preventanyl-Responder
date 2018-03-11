import React, { Component } from 'react';
import { AppRegistry, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Database from '../../database/Database';

export default class RegisterKitForm extends Component {

    constructor () {
        super();
        this.state = {
            address : {
                addressOne    : "",
                addressTwo    : "",
                city          : "",
                country       : "",
                postalCode    : "",
                provincestate : "",
            },
            comments      : "",
            displayName   : "",
            phone         : "",
        };
    }

    render () {
        return (
            <View style = { styles.container }>

                <StatusBar 
                    barStyle = 'light-content'
                />

                    <TextInput
                        placeholder = 'address one'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.addressOne }
                        onChangeText = { username => this.setState ( { username } ) }
                        onSubmitEditing = { () => this.passwordInput.focus () }
                        keyboardType = 'email-address'
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.input } />
                        
                    <TextInput
                        placeholder = 'address two'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />

                    <TextInput
                        placeholder = 'city'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />

                    <TextInput
                        placeholder = 'country'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />

                    <TextInput
                        placeholder = 'postalCode'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />
                     
                    <TextInput
                        placeholder = 'province/state'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />

                    <TextInput
                        placeholder = 'comments'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />

                    <TextInput
                        placeholder = 'display name'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'next'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />

                    <TextInput
                        placeholder = 'phone'
                        placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                        returnKeyType = 'go'
                        value = { this.state.password }
                        onChangeText = { password => this.setState ( { password } ) }
                        onSubmitEditing = { this.loginUser }
                        style = { styles.input } 
                        ref = { (input) => this.passwordInput = input } />


                    <TouchableOpacity onPress = { this.loginUser } style = { styles.buttonContainer }>
                        <Text style = { styles.buttonText }>Register Kit</Text>
                    </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create ({
    container : {
        padding : 20
    },
    input : {
        height : 40,
        backgroundColor : 'rgba(255, 255, 255, 0.2)',
        marginBottom : 10,
        color : '#FFF',
        paddingHorizontal : 10
    },
    buttonContainer : {
        backgroundColor : '#2980b9',
        paddingVertical : 15
    },
    buttonText : {
        textAlign : 'center',
        color : '#FFFFFF',
        fontWeight : '700'
    }
})

AppRegistry.registerComponent ('RegisterKitForm', () => RegisterKitForm);