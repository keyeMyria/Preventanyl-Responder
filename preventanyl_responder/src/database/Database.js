import * as firebase from "firebase";

import spinnerFunction from '../utils/spinnerFunction';
import { genericVerificationAlert, genericErrorAlert } from '../utils/genericAlerts';

const config = {
    apiKey: "AIzaSyBa2ZiHRF2TrEaLBw3JrctIgT-UOU0tN84",
    authDomain: "preventanyl.firebaseapp.com",
    databaseURL: "https://preventanyl.firebaseio.com",
    projectId: "preventanyl",
    storageBucket: "preventanyl.appspot.com",
    messagingSenderId: "111767423984"
};

const firebaseApp        = firebase.initializeApp (config);
const MAX_ATTEMPTS_LOGIN = 10;

export default class Database {

    static firebaseRefs = Object.freeze (
            {
            "staticKitsRef"    : firebase.database ().ref ('statickits'),
            "overdosesRef"     : firebase.database ().ref ('overdoses'),
            "usersRef"         : firebase.database ().ref ().child ("user"),
            "userLocationsRef" : firebase.database().ref  ().child ("userLocations")
        }
    )

    static currentUser = undefined;
    static attempts    = 0;

    static firebaseEventTypes = Object.freeze (
        {
            "Added"   : "child_added",
            "Changed" : "child_changed",
            "Removed" : "child_removed",
        }
    )

    static firebaseSingleEventTypes = Object.freeze (
        {
            "Value" : "value"
        }
    )

    static genericListenForItems (itemsRef, callback) {
        let items = [];

        return itemsRef.on('value', (snapshot) => {

            let val = snapshot.val ();

            if (val)
                callback (val);

        });
    }

    static genericListenForItem (itemsRef, eventType, callback) {
        // retrieve the last record from `itemsRef`
        return itemsRef.limitToLast(1).on(eventType, function(snapshot) {

            let val = snapshot.val ();

            // all records after the last continue to invoke this function
            if (val)
                callback (val);
         
         });
    }

    static addItem (itemsRef, item) {
        itemsRef.update (item)
    }

    static addItemWithChildPath (itemsRef, childPath, item) {
        itemsRef.child (`${ childPath }/`).update (item)
    }

    static addItemWithChildPathId (itemsRef, childPath, item) {
        itemsRef.child (`${ childPath }/${ item.id }`).update (item)
    }

    static addItemWithChildId (itemsRef, item) {
        itemsRef.child (`/${ item.id }`).update (item)
    }

    static getItemWithChildPath (itemsRef, childPath, callback) {

        itemsRef.child (`${ childPath }`).once (Database.firebaseSingleEventTypes.Value, (snapshot) => {

            value = {};

            snapshot.forEach ( (child) => {
                value[child.key] = child.val ();
            });

            callback (value);

        });

    }

    static listenForItems (itemsRef, callback) {

        Database.genericListenForItems (itemsRef, (snapshotVal) => {
            let items = [];
        
            items = Object.keys (snapshotVal).map ((item) => {
                return snapshotVal [item];
            });

            callback (items);
        });

        
    }

    static listenForItemsWithKeys(itemsRef, callback) {

        Database.genericListenForItems (itemsRef, (snapshotVal) => {
            let items = [];
            
            items = Object.keys (snapshotVal).map ((item) => {
                snapshotVal[item].id = item;
                return snapshotVal [item];
            });

            callback (items);
        });

    }

    static checkUserVerfied () {
        return Database.currentUser.emailVerified;
    }

    static async sendVerificationEmail () {
        if (!Database.currentUser.emailVerified) {
            console.log (Database.currentUser.emailVerified);
            Database.currentUser.sendEmailVerification().then ( () => {
                console.log ("email sent");
            }).catch (function (error) {
                console.log (error);
            });
        }
    }
    
    static async notifySignupVerficiation () {
        if (!Database.checkUserVerfied ())
            genericVerificationAlert ('Verification Email Sent', 'Please check email');
    }

    static async notifyUserVerification () {
        if (!Database.checkUserVerfied ())
            genericVerificationAlert ('User not verified', 'Please verify email');
    }

    static async signup(email, pass, successCallback, failureCallback) {
        await firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user) {
            console.log("Account created");
            Database.currentUser = firebase.auth().currentUser;
            Database.sendVerificationEmail ();
            spinnerFunction ( () => {
                Database.notifySignupVerficiation ();
            });
            // use below if wish to store additional information about user
            /* var data = {
                email: $scope.email,
                password: $scope.password,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                id:user.uid
            }
            ref.child(user.uid).set(data).then(function(ref) {// use 'child' and 'set' combination to save data in your own generated key
                console.log("Saved");
                $location.path('/profile');
            }, function(error) {
                console.log(error); 
            }); */
            // Navigate to home page, user is auto logged in
            successCallback(user);
        }).catch(function(error) {
            console.log(error.toString());
            const { errorCode, errorMessage } = error;
            console.log (errorCode);
            console.log (errorMessage);
            failureCallback (error);
        });
    }

    static async login(email, pass, successCallback, failureCallback) {
        if (Database.attempts == MAX_ATTEMPTS_LOGIN) {
            genericErrorAlert ("Too Many Attemps To Login");
            return;
        }

        ++Database.attempts;

        await firebase.auth().signInWithEmailAndPassword(email, pass).then ( (user) => {
                Database.currentUser = user;
                spinnerFunction ( () => {
                    Database.notifyUserVerification ();
                });

                /* if (!user.emailVerified) {
                    Database.sendVerificationEmail ();
                } */
                // Navigate to home page, after login
                successCallback ();
            }).catch(function (error) {
                console.log(error.toString());
                const { errorCode, errorMessage } = error;
                console.log (errorCode);
                console.log (errorMessage);
                failureCallback (error);
            });

    }

    static async logout(successCallback, failureCallback) {
        try {
            await firebase.auth().signOut();
            successCallback ();
            // Navigate to login component
        } catch (error) {
            console.log(error.toString());
            failureCallback (error);
        }
    }

}