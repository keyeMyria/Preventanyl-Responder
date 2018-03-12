import React, { Component } from 'react';
import { AppRegistry, Text, View, Button, TouchableOpacity, Alert, AlertIOS, StyleSheet, Linking, Image } from 'react-native';

import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import Timestamp from 'react-timestamp';
import moment from 'moment';

import * as firebase from 'firebase';
import Database from '../../database/Database'
import PushNotifications from '../../pushnotifications/PushNotifications';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../../utils/location';
import { formatDateTime } from '../../utils/localTimeHelper';
import { genericErrorAlert } from '../../utils/genericAlerts';
import { generateAppleMapsUrl } from '../../utils/linkingUrls';

import MapCallout from '../../subcomponents/MapCallout/MapCallout';

import Overdose from '../../objects/Overdose';

const overdoseTitle = "Overdose";

export default class MapComponent extends Component {

    overdosesLoaded = false;

    constructor () {
        super ();

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
            initialView   : false,
            isLoading     : false,
            notifyMessage   : 'Notifying in 5 seconds',
            notifySeconds : 5,
            notifyTimer   : null
        }

        this.setInitialRegionState ();

        this.findMe = this.findMe.bind (this);

        PushNotifications.setup ();
    }

    async componentDidMount () {
        this.mounted = true;
        this.watchId = navigator.geolocation.watchPosition (
            async (position) => {
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

                if (!Database.currentUser)
                    Database.currentUser = firebase.auth().currentUser;

                if (!PushNotifications.expoToken)
                    await PushNotifications.awaitedSetup ();

                let value = {
                    "id"  : PushNotifications.expoToken,
                    "loc" : {
                        "lat" : this.state.userLocation.latlng.latitude,
                        "lng" : this.state.userLocation.latlng.longitude
                    }
                }

                if (Database.currentUser)
                    Database.addItemWithChildPath (Database.firebaseRefs.userLocationsRef, `/${ Database.currentUser.uid }/`, value)

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

        Database.listenForItems (Database.firebaseRefs.staticKitsRef, (kits) => {
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

        Database.genericListenForItem (Database.firebaseRefs.overdosesRef, Database.firebaseEventTypes.Added, (item) => {
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

        Database.genericListenForItem (Database.firebaseRefs.overdosesRef, Database.firebaseEventTypes.Removed, (item) => {
            if (this.overdosesLoaded) {

                overdoses = this.state.overdoses.filter( (overdose) => {
                    return overdose.id !== item.id
                });

                this.setState ({
                    overdoses : overdoses
                })

            }
        })

        Database.genericListenForItem (Database.firebaseRefs.overdosesRef, Database.firebaseEventTypes.Changed, (item) => {
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

        Database.listenForItems (Database.firebaseRefs.overdosesRef, (items) => {

            if (!this.overdosesLoaded) {
            
                let overdoses = [];

                overdoses = items.map ( (overdose) => { 
                    return Overdose.generateOverdoseFromSnapshot (overdose);
                })

                let currentTimestamp = moment ()
                let startDate = currentTimestamp.clone().subtract (2, 'days').startOf ('day')
                let endDate   = currentTimestamp.clone().add (2, 'days').endOf ('day')

                overdoses = overdoses.filter ( (item) => {
                    let compareDate = moment (item.date)
                    return compareDate.isBetween (startDate, endDate);
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
                                <MapCallout 
                                    title = { marker.title }
                                    description = { marker.description }
                                    url = { generateAppleMapsUrl ( this.state.userLocation.latlng, marker.latlng ) }
                                />
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

                                <MapCallout 
                                    title = { overdoseTitle }
                                    description = { `Reported Overdose at ${ formatDateTime (marker.timestamp) }` }
                                    url = { generateAppleMapsUrl ( this.state.userLocation.latlng, marker.latlng ) }
                                />
                                
                            </MapView.Marker>
                        ))
                    }
                </MapView>
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