import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Text, View, Image, StyleSheet } from 'react-native';

import MapComponent from '../../components/MapComponent/MapComponent';
import ProfileComponent from '../../components/ProfileComponent/ProfileComponent';
import LogoutComponent from '../../components/LogoutComponent/LogoutComponent';

import { logoutConfirmationAlert } from '../../utils/genericAlerts';

const TabNavigation = TabNavigator (
    {
        Map : {
            screen : MapComponent,
            navigationOptions : {
                tabBarLabel : 'Home',
                tabBarIcon  : ( { tintColor } ) => (
                    <Image 
                      source = { require ('../../../assets/map.imageset/map.png') }
                      style  = { 
                          [ 
                              styles.icon, 
                              { 
                                  tintColor : tintColor 
                              } 
                          ] 
                      } />
                )
            },
        },
     /* Profile : {
            screen : ProfileComponent,
            navigationOptions : {
                tabBarLabel : 'Profile',
                tabBarIcon  : ( { tintColor } ) => (
                    <Image 
                    source = { require ('../../../assets/profile.imageset/user_male.png') }
                    style  = { 
                        [ 
                            styles.icon, 
                            { 
                               tintColor : tintColor 
                            } 
                        ] 
                    } />
                )
            },
        }, */
        Logout : {
            screen : LogoutComponent, // Empty screen, not used in this specific case
            navigationOptions : ( { navigation } ) => (
                {
                    tabBarLabel : 'Logout',
                    tabBarIcon  : ( { tintColor } ) => (
                        <Image 
                            source = { require ('../../../assets/profile.imageset/user_male.png') }
                            style  = { 
                                [ 
                                    styles.icon, 
                                    { 
                                        tintColor : tintColor 
                                    } 
                                ] 
                            } />
                    ),
                    tabBarOnPress: (scene, jumpToIndex) => {
                      
                        logoutConfirmationAlert (); // Shows up the alert without redirecting anywhere

                    },
                }
            )
        },
    }, {
        tabBarPosition: 'bottom',
        animationEnabled: true,
        tabBarOptions: {
            activeTintColor: '#e91e63',
        },
    }
);

const styles = StyleSheet.create ({

    icon: {
        width: 26,
        height: 26,
    },

});

export default TabNavigation;