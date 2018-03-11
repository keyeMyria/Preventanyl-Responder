import React, { Component } from 'react';
import { AppRegistry, Text, View, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class MapComponent extends Component {

    constructor () {
        super ();
        this.state = {
            region : this.getInitialState (),
            markers : [
                {
                    latlng : {
                        latitude: 37.78825,
                        longitude: -122.4324,
                    },
                    title : "Marker",
                    description : "Marker",
                }
            ],
            userLocation : { 
                latlng : {
                    latitude  : null,
                    longitude : null,
                },
                error : null,
            }
        }
    }

    componentDidMount () {
        this.watchId = navigator.geolocation.watchPosition (
            (position) => {
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
    }

    componentWillUnmount () {
        navigator.geolocation.clearWatch (this.watchId);
    }

    getInitialState() {
        return {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
      }

    helpMe () {
        Alert.alert (
            'Title',
            'Message',
            [
                {
                    text : 'Notify Angels', onPress : () => console.log ('Notifying Angels')
                },
            ],
            { 
                cancelable : false
            }
        );
    }

    render () {
        return (
            <View style = { styles.container }>
                <MapView 
                    style = { styles.map } >
                    { this.state.userLocation.latlng.latitude != null && this.state.userLocation.latlng.longitude != null &&
                        <MapView.Marker 
                            coordinate  = { this.state.userLocation.latlng } 
                            title       = "Current position"
                            description = "You are here" />
                    }
                </MapView>
                <TouchableOpacity
                    style = { styles.helpme }
                    onPress = { this.helpMe }
                    underlayColor = '#fff'>
                    <Text style = { styles.helpmeText }>Help Me</Text>
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
    helpme : {
        flex : 1,
        backgroundColor : '#8b0000',
    },
    helpmeText : {
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