import React, { Component } from 'react';
import { AppRegistry, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MapView from 'react-native-maps';

import { wordWrap } from '../../utils/strings';

const DIALOG_HEIGHT = 0.3;
const DIALOG_WIDTH  = 0.75;
const DIALOG_LEFT_BUTTON_TEXT = "CANCEL";
const DISMISS_TOUCH_OUTSIDE = false;

export default class MapCallout extends Component {

    constructor (props) {
        super (props);
    }

    render () {

        if (Platform.OS === 'ios') {
            return (
                <MapView.Callout>
                    <Text>{ this.props.title }</Text>
                    <Text>{ wordWrap (this.props.description, 40) }</Text>
                    <TouchableOpacity onPress = { () => {
                        let url = this.props.url;
                        console.log (url);
                        Linking.canOpenURL (url).then ( (supported) => {
                            if (!supported)
                                genericErrorAlert ("You must have apple maps installed to use this")
                            else {
                                return Linking.openURL (url).then ( (data) => {
                                    console.log (data);
                                }).catch ( (error) => {
                                    console.log (error)
                                    genericErrorAlert ("You must have apple maps installed to use this")
                                })
                            }
                        }).catch ( (error) => {
                            console.log (error);
                            genericErrorAlert ("Unable to give directions")
                        })
                     } }>
                        <Image
                            source = {
                                require ('../../../assets/Car.imageset/car.png')
                            }
                        />
                    </TouchableOpacity>
                </MapView.Callout>
            );
        }
    
    }

}

AppRegistry.registerComponent ('MapCallout', () => MapCallout);