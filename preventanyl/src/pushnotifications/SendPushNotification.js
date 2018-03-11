import React from 'react';

import * as firebase from 'firebase';
var data = []

import { Permissions, Notifications } from 'expo';
import { genericAlert, genericErrorAlert } from '../utils/genericAlerts';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../utils/location';

import Database from '../database/Database';
import Overdose from '../objects/Overdose';

state = {
    notification: {},
};

export const loadSubscribers = () => {
    var messages = []

    //return the main promise
    return firebase.database().ref('/subscribers').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var childKey = childSnapshot.key;

            messages.push({
                "to": childKey,
                "sound": "default",
                "body": "New Note Added"
            });
        });

        //firebase.database then() respved a single promise that resolves
        //once all the messages have been resolved 
        return Promise.all(messages)

    }).catch(error => {
        console.log(error)
    })

}

export const registerForPushNotificationsAsync = async () => {
    const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to our backend so we can use it to send pushes from there
    // var updates = {}
    // updates['/expoToken'] = token

    console.log ("TOKEN FOR EXPO PUSH NOTIFICATIONS : ");
    console.log (token);

    var messages = []

    message = {
        "to"    : token,
        "sound" : "default",
        "body"  : "Push Notification",
        "data"  : {
            "title" : "Overdose",
            "message" : "Help"
        }
    }

    messages.push({
        message
    });

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            message
        )
    });

    // return token;
    // await firebase.database().ref('/users/' + currentUser.uid).update(updates)
    //call the push notification 
}

export const handleRegister = () => {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
}

_handleNotification = (notification) => {
    console.log ("NOTIFICATION RECIEVED");
    console.log (notification)
    genericAlert (notification.data.title, notification.data.message);
};

//send the push notification 
export const sendPushNotification = (expoToken) => {
    // var expoToken = childSnapshot.val().expoToken;
    // var messages = []

    // messages.push();

    // return Promise.all(messages)

    message = {
        "to": expoToken,
        "sound": "default",
        "body": "Push Notification"
    }

    console.log (message);
    console.log (JSON.stringify (message))

    fetch ('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)

    }).catch (error => {
        console.log (error);
    })
}

export const notifyAngels = async () => {
    getCurrentLocation ( (result) => {
        location = convertLocationToLatitudeLongitude (result);
        console.log (location);
        overdose = Overdose.generateOverdoseFromLocation (location)
        console.log (overdose)
        url = `https://preventanyl.com/regionfinder.php?id=${ overdose.id }&lat=${ overdose.latlng.latitude }&long=${ overdose.latlng.longitude }`
        Database.addItemWithChildId (Database.overdosesRef, overdose.generateOverdoseForStorage ())
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