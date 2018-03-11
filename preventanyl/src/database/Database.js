import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyBa2ZiHRF2TrEaLBw3JrctIgT-UOU0tN84",
    authDomain: "preventanyl.firebaseapp.com",
    databaseURL: "https://preventanyl.firebaseio.com",
    projectId: "preventanyl",
    storageBucket: "preventanyl.appspot.com",
    messagingSenderId: "111767423984"
};

const firebaseApp = firebase.initializeApp (config);

export default class Database {

    static staticKitsRef = firebase.database ().ref('statickits');
    static overdosesRef  = firebase.database ().ref('overdoses');

    static firebaseEventTypes = Object.freeze ({
        "Added"   : "child_added",
        "Changed" : "child_changed",
        "Removed" : "child_removed"
    })

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

    static addItemWithChildPathId (itemsRef, childPath, item) {
        itemsRef.child (`${ childPath }/${ item.id }`).update (item)
    }

    static addItemWithChildId (itemsRef, item) {
        itemsRef.child (`/${ item.id }`).update (item)
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
    
    async signup(email, pass) {
        try {
            await firebase.auth().
                createUserWithEmailAndPassword(email, pass);

            console.log("Account created");

            // Navigate to home page, user is auto logged in
        } catch (error) {
            console.log(error.toString());
        }
    }

    static async login(email, pass) {
        try {
            await firebase.auth().
                signInWithEmailAndPassword(email, pass);

            console.log("Logged in");

            // Navigate to home page, after login
        } catch (error) {
            console.log(error.toString());
        }
    }

    static async logout() {
        try {
            await firebase.auth().signOut();

            // Navigate to login component
        } catch (error) {
            console.log(error.toString());
        }
    }


}