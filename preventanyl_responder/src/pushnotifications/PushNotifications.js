import React from 'react';

import * as firebase from 'firebase';
var data = []

import { Permissions, Notifications } from 'expo';
import { genericAlert, genericErrorAlert } from '../utils/genericAlerts';

import { getCurrentLocation, convertLocationToLatitudeLongitude } from '../utils/location';

import Database from '../database/Database';
import Overdose from '../objects/Overdose';

export default class PushNotifications {

    state = {
        notification: {},
    };

    static expoToken;

    static setup = async () => {
        PushNotifications.registerForPushNotificationsAsync ();
        PushNotifications.handleRegister ();
    }

    static awaitedSetup = async () => {
        await PushNotifications.registerForPushNotificationsAsync ();
        await PushNotifications.handleRegister ();
    }

    static loadSubscribers = () => {
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
    
    static registerForPushNotificationsAsync = async () => {
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
        if (finalStatus !== 'granted')
            return;
    
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        PushNotifications.expoToken = token;
    
        // POST the token to our backend so we can use it to send pushes from there
        // var updates = {}
        // updates['/expoToken'] = token
    
        // console.log ("TOKEN FOR EXPO PUSH NOTIFICATIONS : ", token);

        console.log ('EXPOTOKEN : ', PushNotifications.expoToken)
    
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
        /* return fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                message
            )
        }); */
    
        // return token;
        // await firebase.database().ref('/users/' + currentUser.uid).update(updates)
        //call the push notification 
    }
    
    static handleRegister = async () => {
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }
    
    _handleNotification = (notification) => {
        console.log ("NOTIFICATION RECIEVED");
        console.log (notification)
        genericAlert (notification.data.title, notification.data.message);
    };
    
    //send the push notification 
    static sendPushNotification = (expoToken) => {
        // var expoToken = childSnapshot.val().expoToken;
        // var messages = []
    
        // messages.push();
    
        // return Promise.all(messages)
    
        message = {
            "to"    : expoToken,
            "sound" : "default",
            "body"  : "Push Notification"
        }
    
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
    
    

}