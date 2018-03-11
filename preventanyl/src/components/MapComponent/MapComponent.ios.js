import React, { Component } from 'react';
import { AppRegistry, Text, View, Button, TouchableOpacity, Alert, AlertIOS, StyleSheet, Linking, Image } from 'react-native';

import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import Timestamp from 'react-timestamp';
import PopupDialog from 'react-native-popup-dialog';

import * as firebase from 'firebase';
import Database from '../../database/Database'
import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../../utils/location';
import { genericErrorAlert } from '../../utils/genericAlerts';
import GenericPopupDialog from '../../utils/GenericPopupDialog';
import { registerForPushNotificationsAsync, sendPushNotification, handleRegister, notifyAngels } from '../../pushnotifications/SendPushNotification';

import Overdose from '../../objects/Overdose';

const notifyTitle = "Notify Angels";

export default class MapComponent extends Component {

    overdosesLoaded = false;

    constructor () {
        super ();

        this.getInitialView ();

        this.state = {
            region : null,
            staticKits : [],
            overdoses : [],
            userLocation : {
                latlng : {
                    latitude  : null,
                    longitude : null,
                },
                error : null,
            },
            userLoaded    : false,
            initialView   : false,
            isLoading     : false,
            notifyMessage   : 'Notifying in 5 seconds',
            notifySeconds : 5,
            notifyTimer   : null
        }

        this.setInitialRegionState ();

        this.findMe = this.findMe.bind (this);
        this.helpMe = this.helpMe.bind (this);
        this.getInitialView = this.getInitialView.bind(this);
    }

    getInitialView () {

        firebase.auth ().onAuthStateChanged ( (user) => {
            let initialView = user ? "Home" : "Login";

            this.setState ({
                userLoaded  : true,
                initialView : initialView
            })
        })

    }

    async componentDidMount () {
        this.mounted = true;
        this.watchId = navigator.geolocation.watchPosition (
            (position) => {
                // console.log (position)
                this.setState ({
                    userLocation : {
                        latlng : {
                            latitude  : position.coords.latitude,
                            longitude : position.coords.longitude,
                        },
                        error     : null,
                    }
                });
            },
            (error) => this.setState ( {
                error : error.message
            }),
            { 
                enableHighAccuracy : true,
                timeout : 20000,
                maximumAge : 1000,
                distanceFilter : 10
            }
        );

        Database.listenForItems (Database.staticKitsRef, (kits) => {
            let staticKits = [];
            for (let kit of kits) {
                staticKits.push ({
                    title : kit.displayName,
                    description : kit.comments,
                    latlng : {
                        latitude : kit.coordinates.lat,
                        longitude : kit.coordinates.long,
                    },
                    id : kit.id,
                    key : kit.id
                })
            }
            
            this.setState ({
                staticKits : staticKits
            });
        });

        Database.genericListenForItem (Database.overdosesRef, Database.firebaseEventTypes.Added, (item) => {
            if (this.overdosesLoaded) {

                overdoses = this.state.overdoses;

                overdose = Overdose.generateOverdoseFromSnapshot(item);

                index = overdoses.find (obj => obj.id === overdose.id)

                if (index !== undefined && index !== -1)
                    return;

                overdoses.push (overdose)

                this.setState ({
                    overdoses : overdoses
                })

            }
        })

        Database.genericListenForItem (Database.overdosesRef, Database.firebaseEventTypes.Removed, (item) => {
            if (this.overdosesLoaded) {

                overdoses = this.state.overdoses.filter( (overdose) => {
                    return overdose.id !== item.id
                });

                this.setState ({
                    overdoses : overdoses
                })

            }
        })

        Database.genericListenForItem (Database.overdosesRef, Database.firebaseEventTypes.Changed, (item) => {
            if (this.overdosesLoaded) {
                
                overdoses = this.state.overdoses;

                overdose = Overdose.generateOverdoseFromSnapshot(item);

                index = overdoses.find (obj => obj.id === overdose.id)

                if (index === undefined || index === -1)
                    return;

                overdoses[index] = overdose;

                this.setState ({
                    overdoses : overdoses
                })

            }
        })

        Database.listenForItems (Database.overdosesRef, (items) => {
            if (!this.overdosesLoaded) {
            
                let overdoses = [];

                overdoses = items.map ( (overdose) => { 
                    return Overdose.generateOverdoseFromSnapshot (overdose);
                })

                this.setState ({
                    overdoses : overdoses
                })

                this.overdosesLoaded = true;

            }
        });

        // Replace later with one function
        // let token = await registerForPushNotificationsAsync ();
        // handleRegister ();
        // sendPushNotification (token);

    }

    async componentWillUnmount () {
        navigator.geolocation.clearWatch (this.watchId);
        this.mounted = false;
    }

    genericCreateRegion (location) {
        return {
            latitude       : location.latitude,
            longitude      : location.longitude,
            latitudeDelta  : 0.005,
            longitudeDelta : 0.005
        }
    }

    genericCreateRegionDelta (location, latitudeDelta, longitudeDelta) {
        return {
            latitude       : location.latitude,
            longitude      : location.longitude,
            latitudeDelta  : latitudeDelta,
            longitudeDelta : longitudeDelta
        }
    }

    createRegionCurrentLocation (successCallback, failureCallback) {

        getCurrentLocation ((result) => {
            let location = convertLocationToLatitudeLongitude (result);

            if (this.mounted)
                this.state.userLocation = location;

            location = this.genericCreateRegion (location.latlng);

            successCallback (location);
        }, (error) => {
            failureCallback (new Error("Unable to create region"));
        })

    }

    setInitialRegionState() {

        this.createRegionCurrentLocation ( (result) => {
            this.setState ({
                region : result
            });
        }, (error) => {
            this.setState ({
                region : {
                    latitude: 49.246292,
                    longitude: -123.116226,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }
            });
        });

    }

    resetHelpTimer () {

        if (this.state.notifyTimer != null) {
            clearInterval (this.state.notifyTimer);
        }

        this.setState ({
            notifySeconds : 5,
            notifyMessage   : `Notifying in ${ this.state.notifySeconds } seconds`
        })
       
    }

    helpMe () {

        this.resetHelpTimer ();

        this.popupDialog.show();

        let notifyTimer = setInterval (() => {
            if (this.state.notifySeconds > 0) {
                this.setState ({
                    notifySeconds : this.state.notifySeconds - 1,
                    notifyMessage : `Notifying in ${ this.state.notifySeconds } seconds`
                })

                console.log (this.state.notifyMessage);
            } else {
                this.popupDialog.dismiss ();
                console.log ("TIME IS ZERO");
                notifyAngels ();
                clearInterval (this.state.notifyTimer);
            }
        }, 1000);

        this.setState ({
            notifyTimer : notifyTimer
        })
        
    }

    findMe () {

        this.createRegionCurrentLocation ((region) => {
            this.setState ({
                region : region
            })

            // Center on user position
            this.map.animateToRegion (this.state.region);
        }, (error) => {
            genericErrorAlert ("Failed to find user");
        });

    }

    render () {
        return (
            <View style = { styles.container }>
                <TouchableOpacity
                    styles = { styles.findMeBtn }
                    onPress = { this.findMe } 
                    underlayColor = '#fff'>
                    <Image 
                        source = {
                            require('../../../assets/location.imageset/define_location.png')
                        }
                    />

                </TouchableOpacity>
                {/* <PopupDialog
                    ref = { (popupDialog) => { this.popupDialog = popupDialog; }} >
                    <View>
                        <Text>{ this.state.notifyTitle }</Text>
                    </View>
                </PopupDialog> */}
                <GenericPopupDialog 
                    title = { notifyTitle } 
                    message = { this.state.notifyMessage } 
                    ref = { (popupDialog) => { this.popupDialog = popupDialog; } } 
                    actionButtonText = "Notify Angels"
                    cancelFunction = { () => {
                        console.log ("Cancelling Popup")
                        this.resetHelpTimer ();
                    }}
                    actionFunction = { () => { 
                            console.log ("Notifying Angels");
                            notifyAngels ();
                            this.resetHelpTimer ();
                            this.popupDialog.dismiss (); 
                        }
                    } />
                <MapView 
                    style = { styles.map }
                    initialRegion = { this.state.region }
                    ref   = { map => { 
                        this.map = map 
                        }
                    } >
                    { this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null &&
                        <MapView.Marker 
                            coordinate  = { this.state.userLocation.latlng } 
                            title       = "Current position"
                            description = "You are here" />
                    }

                    {
                        this.state.staticKits.length > 0 &&
                        this.state.staticKits.map ((marker, index) => (
                            <MapView.Marker
                                key         = { index }
                                coordinate  = { marker.latlng }
                                title       = { marker.title }
                                description = { marker.description } >
                                <MapView.Callout>
                                    <Text>{ marker.title }</Text>
                                    <Text>{ marker.description }</Text>
                                    <TouchableOpacity onPress = { () => {
                                        let url = `http://maps.apple.com/?saddr=${ this.state.userLocation.latlng.latitude },${ this.state.userLocation.latlng.longitude }&daddr=${ marker.latlng.latitude },${ marker.latlng.longitude }`;
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
                                     } } style={ [ styles.bubble, styles.button ] }>
                                        <Image
                                            source = {
                                                require('../../../assets/Car.imageset/car.png')
                                            }
                                        />
                                    </TouchableOpacity>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))
                    }
                    {
                        this.state.overdoses.length > 0 && 
                        this.state.overdoses.map ((marker, index) => (
                            <MapView.Marker
                                key         = { marker.key }
                                coordinate  = { marker.latlng }
                                title       = ''
                                description = ''
                                image       = {
                                    require('../../../assets/key.imageset/key.png')
                                }>
                                <MapView.Callout>
                                    <Text>
                                        Reported Overdose at <Timestamp time = { marker.timestamp } component = { Text } />
                                    </Text>
                                    
                                </MapView.Callout>
                            </MapView.Marker>
                        ))
                    }
                </MapView>
                <TouchableOpacity
                    style = { styles.helpMeBtn }
                    onPress = { this.helpMe.bind (this) }
                    underlayColor = '#fff'>
                    <Text style = { styles.helpMeText }>Help Me</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create ({
    container : {
        flex : 1,
        backgroundColor : '#F5FCFF',
        flexDirection : 'column',
    },
    map : {
        flex : 12,
    },
    helpMeBtn : {
        flex : 1,
        backgroundColor : '#8b0000',
    },
    helpMeText : {
        color:'#fff',
        textAlign:'center',
        fontWeight: 'bold',
        paddingLeft : 10,
        paddingRight : 10,
        paddingTop : 10,
        paddingBottom : 10
    }
})

AppRegistry.registerComponent ('MapComponent', () => MapComponent);