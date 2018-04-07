import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

import Database from '../../database/Database';

export default class LogoutComponent extends Component {

    static logoutUser = () => {

        Database.getItemWithChildPath (Database.firebaseRefs.userLocationsRef, `/${ Database.currentUser.uid }/`, (obj) => {
            
            if (Database.currentUser) {

                obj.logged_in = false;
                Database.addItemWithChildPath (Database.firebaseRefs.userLocationsRef, `/${ Database.currentUser.uid }/`, obj);
                Database.logout (() => {
                    console.log ("Logged out");
                }, () => {
                    console.log ("Failure to log out");
                });

            }

        })

    }

    render () {
        const { navigate } = this.props.navigation;
        
        return (
            <View>
                <Text>This is the logout component</Text>
            </View>
       );
    }
}

AppRegistry.registerComponent ('LogoutComponent', () => LogoutComponent);