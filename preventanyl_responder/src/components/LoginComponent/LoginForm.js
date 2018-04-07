import React, { Component } from 'react';
import { AppRegistry, View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import Database from '../../database/Database';
import { genericAlert, genericErrorAlert, genericErrorDescriptionAlert, genericRequiredFieldAlert, genericNotFormattedFieldAlert } from '../../utils/genericAlerts';
import spinnerFunction from '../../utils/spinnerFunction';
import { asyncTimeoutFunction } from '../../utils/timedFunctions';
import Validation from '../../utils/Validation';

export default class LoginForm extends Component {

    constructor () {
        super();
        this.state = {
            username   : '',
            password   : '',
            isLoading  : false
        };
    }
   
    async componentWillUnmount () {
        this.mounted = false;
    }

    async componentDidMount () {
        this.mounted = true;
    }
   
    _login = async () => {
        try {
            this.setState ({
                isLoading : true
            });

            const { username, password } = this.state;
            console.log (username);
            console.log (password);

            usernameEmpty = !Validation.validateString (username);
            passwordEmpty = !Validation.validateString (password);

            if (usernameEmpty && passwordEmpty) {
                genericRequiredFieldAlert ("username and password");
                return;
            } else {
                field = "";

                if (usernameEmpty)
                    field = "username";
                else if (passwordEmpty)
                    field = "password";
                else if (!Validation.validateEmail (username)) {
                    genericNotFormattedFieldAlert ("Username");
                    return;
                }

                if (field !== "") {
                    genericRequiredFieldAlert (field);
                    return;
                }
            }

            // using await keeps it in the try allowing the spinner to keep spinning
            
            await asyncTimeoutFunction ( 10000, async () => 
                {
                    await Database.login (username, password, () => 
                        {
                            console.log ("success function");
                        }, () => 
                            {
                                spinnerFunction ( () => 
                                    {
                                        genericErrorAlert ("Unable to login")
                                    }
                                );
                                console.log ("failure function");
                            }
                        );
                }, (response) => 
                {
                    console.log ("Success");
                }, (error) => {
                    console.log ("Failure");
                }
            );

        } catch (error) {
            console.warn (error);
            genericErrorDescriptionAlert (error);
            // throw error;
        } finally {
            console.log (this.mounted);
            console.log (this.state.isLoading);

            if (this.mounted)
                this.setState (
                    {
                        isLoading : false
                    }
                )
            console.log (this.state.isLoading);
        }
    }

    render () {
        return (
            <View style = { styles.container }>

                <Spinner
                    visible = { this.state.isLoading }
                    textContent = { "Loading..." }
                    textStyle = {
                        { color : '#FFF' }
                    }
                    cancelable = { false } />

                <TextInput
                    placeholder = 'username or email'
                    placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                    returnKeyType = 'next'
                    value = { this.state.username }
                    onChangeText = { username => this.setState ( { username } ) }
                    onSubmitEditing = { () => this.passwordInput.focus () }
                    keyboardType = 'email-address'
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = { styles.input } />
                    
                <TextInput
                    placeholder = 'password'
                    placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                    returnKeyType = 'go'
                    value = { this.state.password }
                    onChangeText = { password => this.setState ( { password } ) }
                    onSubmitEditing = { this.loginUser }
                    style = { styles.input } 
                    ref = { (input) => this.passwordInput = input }
                    secureTextEntry />

                <TouchableOpacity onPress = { this._login } style = { styles.buttonContainer }>
                    <Text style = { styles.buttonText }>Login</Text>
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

AppRegistry.registerComponent ('LoginForm', () => LoginForm);