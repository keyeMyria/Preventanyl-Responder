import React from 'react';

import { genericErrorAlert } from '../utils/genericAlerts';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../utils/location';

import Database from '../database/Database';
import Overdose from '../objects/Overdose';
import PushNotifications from './PushNotifications';

export default class PreventanylNotifications {

    static notifyAngels = async () => {
        getCurrentLocation ( (result) => {
            location = convertLocationToLatitudeLongitude (result);
            console.log (location);
            overdose = Overdose.generateOverdoseFromLocation (location)
            console.log (overdose)
            url = `https://preventanyl.com/regionfinder.php?id=${ overdose.id }&lat=${ overdose.latlng.latitude }&long=${ overdose.latlng.longitude }`
            Database.addItemWithChildId (Database.firebaseRefs.overdosesRef, overdose.generateOverdoseForStorage ())
            console.log (url);

            // POST the token to your backend server from where you can retrieve it to send push notifications.
            fetch(url, {
                method: 'POST',
            }).catch (error => {
                console.log (error)
            })

        }, (error) => {
            console.log (error);
            genericErrorAlert ('unable to notify nearby, please check network connection and gps');
        })      
        
        // overdosesRef.child(overdose.id).updateChildValues(value)
    }

}