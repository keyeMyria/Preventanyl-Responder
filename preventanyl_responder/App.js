import React from 'react';
import { AppRegistry, AppState, Platform, View, StyleSheet } from 'react-native';

import { AppLoading } from 'expo';

import * as firebase from "firebase";

import TabNavigation from './src/navigation/TabNavigation/TabNavigation';
import StackNavigation from './src/navigation/StackNavigation/StackNavigation';

import StatusBarBackground from './src/subcomponents/StatusBarBackground/StatusBarBackground';

import Colours from './src/utils/Colours';

export default class App extends React.Component {

    state = {
        loggedIn        : false,
        isReady         : false,
        appState        : AppState.currentState,
        statusBarColour : Colours.HEX_COLOURS.SOFT_BLUE
    };

    static pauseFuncs  = [];
    static resumeFuncs = [];

    async componentWillMount () {
        firebase.auth ().onAuthStateChanged ( user =>
            this.setState (
                {
                    loggedIn        : user,
                    statusBarColour : user ? Colours.HEX_COLOURS.DARK_WHITE : Colours.HEX_COLOURS.SOFT_BLUE
                }
            )
        );
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            App.resumeFuncs.map ( func => 
                {
                    func ();
                }
            )
        } else {
            console.log('App has gone to the background!')
            App.pauseFuncs.map ( func => 
                {
                    func ();
                }
            )
        }

        this.setState (
            { 
                appState: nextAppState
            }
        );
    }

    static addPauseFunction (func) {
        App.pauseFuncs.push (func);
    }

    static addResumeFunction (func) {
        App.resumeFuncs.push (func);
    }

    static emptyPauseFunctions () {
        App.pauseFuncs = [];
    }

    static emptyResumeFunctions () {
        App.resumeFuncs = [];
    }

    render() {
        if (this.state.isReady)
            return (
                <View style = { styles.container }>
                    <StatusBarBackground style = { 
                        {
                            backgroundColor : this.state.statusBarColour
                        }
                    } />
                    { this.state.loggedIn ? <TabNavigation /> : <StackNavigation /> }
                </View>
            );
        else
            return (
                <AppLoading
                    startAsync = { () => {} }
                    onFinish = { () => {
                        this.setState (
                                {
                                    isReady : true
                                }
                            )
                        }
                    }
                    onError = { (error) => {
                            console.warn (error)
                        }
                    } />
            );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

AppRegistry.registerComponent ('App', () => App);