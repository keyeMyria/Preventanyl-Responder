import React, { Component } from 'react';
import { AppRegistry, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import LocationHelper from '../../utils/location';

import MapView from 'react-native-maps';

import { wordWrap } from '../../utils/strings';
import { genericErrorAlert } from '../../utils/genericAlerts';

import { openMaps } from '../../utils/linkingUrls';

const DIALOG_HEIGHT = 0.3;
const DIALOG_WIDTH  = 0.75;
const DIALOG_LEFT_BUTTON_TEXT = "CANCEL";
const DISMISS_TOUCH_OUTSIDE = false;

const NO_USERLOCAION_AVAILABLE_ERROR_MESSAGE = "Your location is not available";

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
                        if (LocationHelper.locationEnabled && url != '')
                            openMaps (url);
                        else {
                            genericErrorAlert (NO_USERLOCAION_AVAILABLE_ERROR_MESSAGE);
                        }
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

        return (
            <MapView.Callout>
                    <Text>{ this.props.title }</Text>
                    <Text>{ wordWrap (this.props.description, 40) }</Text>
                    <TouchableOpacity onPress = { () => {
                        let url = this.props.url;
                        console.log (url);
                        if (LocationHelper.locationEnabled && url != '')
                            openMaps (url);
                        else {
                            genericErrorAlert (NO_USERLOCAION_AVAILABLE_ERROR_MESSAGE);
                        }
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

AppRegistry.registerComponent ('MapCallout', () => MapCallout);