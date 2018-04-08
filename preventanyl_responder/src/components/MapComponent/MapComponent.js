import React, { Component } from 'react';
import { AppRegistry, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

import MapView, { AnimatedRegion, Animated } from 'react-native-maps';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

import * as firebase from 'firebase';

import Database from '../../database/Database'
import PushNotifications from '../../pushnotifications/PushNotifications';
import PermissionsHandler from '../../utils/PermissionsHandler';

import LocationHelper, { convertLocationToLatitudeLongitude, getCurrentLocation, getCurrentLocationAsync, setupLocation } from '../../utils/location';
import { formatDateTime, generateRangeCurrent } from '../../utils/localTimeHelper';
import { genericErrorAlert, genericDisclaimerAlert } from '../../utils/genericAlerts';
import { generateAppleMapsUrl } from '../../utils/linkingUrls';

import Network from '../../utils/Network';
import Colours from '../../utils/Colours';
import Storage from '../../utils/Storage';
import MapCallout from '../../subcomponents/MapCallout/MapCallout';

import Overdose from '../../objects/Overdose';
import StaticKit from '../../objects/StaticKit';

import App from '../../../App';

const overdoseTitle = "Overdose";

export default class MapComponent extends Component {

    overdosesLoaded                = false;
    watchId                        = undefined;
    static spinnerFunctionsLoading = 0;

    // Always undefined, ??
    static images = Object.freeze (
        {
            "OVERDOSE"          : require ('../../../assets/key.imageset/key.png'),
            "LOCATION_ENABLED"  : require ('../../../assets/location.imageset/define_location.png'),
            "LOCATION_DISABLED" : require ('../../../assets/key.imageset/key.png'),
        }
    )

    static images = {};

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
            detailedUserLocation : {
                coords : {
                    accuracy         : null,
                    altitude         : null,
                    altitudeAccuracy : null,
                    heading          : null,
                    latitude         : null,
                    longitude        : null,
                    speed            : null,
                  },
                  timestamp : null,
            },
            locationImage   : require ('../../../assets/location.imageset/define_location.png'),
            isLoading       : false,
            notifyMessage   : 'Notifying in 5 seconds',
            notifySeconds   : 5,
            notifyTimer     : null,
        }

        this.setInitialRegionState ();

        this.findMe = this.findMe.bind (this);

        PushNotifications.setup ();
    }

    watchLocation () {
        this.stopFollowingUserLocation ();
        this.watchId = navigator.geolocation.watchPosition (
            async (position) => {
                // console.log (position)

                this.setState (
                    {
                        userLocation : {
                            latlng : {
                                latitude  : position.coords.latitude,
                                longitude : position.coords.longitude,
                            },
                            error     : null,
                        },
                        detailedUserLocation : position
                    }
                );

                if (!Database.currentUser)
                    Database.currentUser = firebase.auth().currentUser;

                if (!PushNotifications.expoToken)
                    await PushNotifications.awaitedSetup ();

                let value = {
                    "id"  : PushNotifications.expoToken,
                    "logged_in" : true,
                    "loc" : {
                        "lat" : this.state.userLocation.latlng.latitude,
                        "lng" : this.state.userLocation.latlng.longitude
                    }
                }

                if (Database.currentUser)
                    Database.addItemWithChildPath (Database.firebaseRefs.userLocationsRef, `/${ Database.currentUser.uid }/`, value)

            },
            (error) => this.setState ( 
                {
                    error : error.message
                }
            ),
            { 
                enableHighAccuracy : true,
                timeout : 20000,
                maximumAge : 1000,
                distanceFilter : 10
            }
        );
    }

    stopFollowingUserLocation () {
        navigator.geolocation.clearWatch (this.watchId);
    }

    async componentDidMount () {
        this.mounted = true;

        // If in future, add multiple disclaimer values, 
        // adjust code to see all options in Storage values object.
        Storage.getDisclaimerData ( (data) => 
            {
                console.log ("DATA", data);
            }, (error) => {
                genericDisclaimerAlert ( () => 
                    {
                        Storage.setDisclaimerData (Storage.values.DISCLAIMER_RESPONDER.VALID.ACCEPTED, () => 
                            {
                                console.log (Storage.values.DISCLAIMER_RESPONDER.VALID.ACCEPTED);
                            }
                        ,(error) => 
                            {
                                console.log ("ERROR", error);
                            }
                        )
                    }
                )
            }
        )

        this.setState (
            {
                isLoading : true
            }
        );

        Network.setupNetworkConnection ();

        this.watchLocation ();

        // Could clear by adding to pauseFunctions however it is being cleared in componentWillUnmount
        App.addResumeFunction ( () =>
            {

                setupLocation ( (result) => 
                    {

                        this.convertLocationMount (result, (location) => 
                            {
                                console.log ('location ,', location);
                            }
                        )
                    
                        this.watchLocation ();

                    }, (error) => 
                        {
                            console.log (error);
                        }
                )

            }

        );

        App.addResumeFunction ( () => 
            {
                Network.changeNetworkStatus    ();
                Network.setupNetworkConnection ();
            }
        )

        App.addPauseFunction ( () => 
            {
                Network.genericRemoveAllListeners (Network.eventTypes.CONNECTION_CHANGE);
            }
        )

        Database.listenForItems (Database.firebaseRefs.staticKitsRef, async (kits) => 
            {

                await this.simpleLoadingFunction ( async () => 
                    {
                        let staticKits = [];

                        staticKits = kits.map ( (kit) => 
                            {
                                return StaticKit.generateStaticKitFromSnapshot (kit);
                            }
                        )
                            
                        this.setState (
                            {
                                staticKits : staticKits
                            }
                        );
                        
                    }
                )

            }
        );

        Database.genericListenForItem (Database.firebaseRefs.overdosesRef, Database.firebaseEventTypes.Added, (item) => 
            {
                if (this.overdosesLoaded) {

                    overdoses = this.state.overdoses;

                    overdose = Overdose.generateOverdoseFromSnapshot(item);

                    index = overdoses.find (obj => obj.id === overdose.id)

                    let dateRange = generateRangeCurrent (2);

                    let compareDate = moment (overdose.date)

                    if ((index !== undefined && index !== -1) || !compareDate.isBetween (dateRange.startDate, dateRange.endDate)) 
                        return;

                    overdoses.push (overdose)

                    this.setState (
                        {
                            overdoses : overdoses
                        }
                    )

                }
            }
        )

        Database.genericListenForItem (Database.firebaseRefs.overdosesRef, Database.firebaseEventTypes.Removed, (item) => 
            {
                if (this.overdosesLoaded) {

                    overdoses = this.state.overdoses.filter( (overdose) => {
                        return overdose.id !== item.id
                        }
                    );

                    this.setState (
                        {
                            overdoses : overdoses
                        }
                    )

                }
            }
        )

        Database.genericListenForItem (Database.firebaseRefs.overdosesRef, Database.firebaseEventTypes.Changed, (item) => 
            {
                if (this.overdosesLoaded) {
                    
                    overdoses = this.state.overdoses;

                    overdose = Overdose.generateOverdoseFromSnapshot(item);

                    index = overdoses.find (obj => obj.id === overdose.id)

                    if (index === undefined || index === -1)
                        return;

                    overdoses[index] = overdose;

                    this.setState (
                        {
                            overdoses : overdoses
                        }
                    )

                }
            }
        )

        Database.listenForItems (Database.firebaseRefs.overdosesRef, async (items) => 
            {

                if (!this.overdosesLoaded) {
                    await this.simpleLoadingFunction ( async () => 
                        {

                            let overdoses = [];

                            overdoses = items.map ( (overdose) => 
                                { 
                                    return Overdose.generateOverdoseFromSnapshot (overdose);
                                }
                            )

                            let dateRange = generateRangeCurrent (2);

                            overdoses = overdoses.filter ( (item) => 
                                {
                                    let compareDate = moment (item.date)
                                    return compareDate.isBetween (dateRange.startDate, dateRange.endDate);
                                }
                            )

                            this.setState (
                                {
                                    overdoses : overdoses
                                }
                            )

                            this.overdosesLoaded = true;

                        }
                    )
                    
                }

            }

        );

        // Replace later with one function
        // let token = await registerForPushNotificationsAsync ();
        // handleRegister ();
        // sendPushNotification (token);

    }

    async componentWillUnmount () {
        this.stopFollowingUserLocation ();
        this.mounted = false;
    }

    // PRECONDITION : isLoading must be true before function call
    simpleLoadingFunction = async (func) => {
        try {
            ++MapComponent.spinnerFunctionsLoading;

            // Code commented below will not start the spinner, therefore precondition
            /*
                this.setState ({
                    isLoading : true
                });
            */

            await func ();
            
        } catch (error) {
            console.warn (error);
            genericErrorDescriptionAlert (error);
        } finally {
            --MapComponent.spinnerFunctionsLoading;

            if (MapComponent.spinnerFunctionsLoading === 0 && this.mounted)
                this.setState (
                    {
                        isLoading : false
                    }
                )
        }
    }

    setLocationCheck () {
        this.setState (
            {
                locationEnabled : LocationHelper.locationEnabled
            }
        )
    }

    changeFindMeImage () {
        // const filePath = LocationHelper.locationEnabled ? imagePaths.LOCATION_ENABLED: imagePaths.LOCATION_DISABLED
        
        /* this.setState (
            {
                locationImage : require (filePath)
            }
        ) */

        this.setState (
            {
                locationImage : LocationHelper.locationEnabled ? MapComponent.images.LOCATION_ENABLED : MapComponent.images.LOCATION_DISABLED
            }
        )
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

    convertLocationMount (result, successCallback) {
        let location = convertLocationToLatitudeLongitude (result);

        if (this.mounted)
            this.setState (
                {
                    userLocation         : location,
                    detailedUserLocation : result
                }
            );

        location = this.genericCreateRegion (location.latlng);

        successCallback (location);
    }

    createRegionCurrentLocation (successCallback, failureCallback) {

        getCurrentLocation ((result) => {
            this.convertLocationMount (result, (location) => {
                successCallback (location);
            })

        }, (error) => {
            failureCallback (new Error("Unable to create region"));
        })

    }

    setupRegionCurrentLocation (successCallback, failureCallback) {
        setupLocation ((result) => {
            let location = convertLocationToLatitudeLongitude (result);

            if (this.mounted)
                userLocation = location;

            location = this.genericCreateRegion (location.latlng);

            successCallback (location);
        }, (error) => {
            failureCallback (new Error("Unable to create region"));
        })
    }

    setInitialRegionState() {

        this.setupRegionCurrentLocation ( (result) => {
            this.setState (
                {
                    region : result
                }
            );
        }, (error) => 
            {
                this.setState (
                    {
                        region : {
                            latitude: 49.246292,
                            longitude: -123.116226,
                            latitudeDelta: 0.2,
                            longitudeDelta: 0.2,
                        }
                    }
                );
            }
        );

    }

    findMe () {

        this.createRegionCurrentLocation ((region) => {
            this.setState (
                {
                    region : region
                }
            )

            // Center on user position
            this.map.animateToRegion (this.state.region);
        }, (error) => 
            {
                genericErrorAlert ("Failed to find user");
            }
        );

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

                <MapView 
                    style = { styles.map }
                    initialRegion = { this.state.region }
                    ref   = { map => { 
                        this.map = map 
                        }
                    } >

                    <TouchableOpacity
                        style = { styles.findMeBtn }
                        onPress = { this.findMe } 
                        underlayColor = '#fff'>

                        <Image 
                            source = {
                                require('../../../assets/location.imageset/define_location.png')
                            } />

                    </TouchableOpacity>

                    { this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null && 

                        <MapView.Marker 
                            coordinate  = { this.state.userLocation.latlng } 
                            title       = "Current position"
                            description = "You are here"
                            pinColor    = { Colours.HEX_COLOURS.BLACK } />
                     
                       /* <MapView.Circle
                            center = { this.state.userLocation.latlng }
                            fillColor = { "#1f68ef" }
                            radius = { this.state.detailedUserLocation.coords.accuracy }
                            strokeColor = { "#add9f4" }
                            strokeWidth = { 2 } /> */
                    }

                    {
                        this.state.staticKits.length > 0 &&
                        this.state.staticKits.map ((marker, index) => (
                            <MapView.Marker
                                key         = { index }
                                coordinate  = { marker.latlng }
                                title       = { marker.title }
                                description = { marker.formattedDescription } >

                                <MapCallout 
                                    title = { marker.title }
                                    description = { marker.formattedDescription }
                                    url = { generateAppleMapsUrl ( this.state.userLocation.latlng, marker.latlng ) } />

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
                                pinColor    = { Colours.HEX_COLOURS.BLUE } >

                                { /* Added space at end of description so that the AM/PM is not a new line */ }

                                <MapCallout 
                                    title = { overdoseTitle }
                                    description = { `Reported Overdose at:\n${ formatDateTime (marker.timestamp) } ` }
                                    url = { this.state.userLocation ? generateAppleMapsUrl ( this.state.userLocation.latlng, marker.latlng ) : '' }
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
    },
    markerIcon : {
        width:  50,
        height: 50,
    }
})

AppRegistry.registerComponent ('MapComponent', () => MapComponent);