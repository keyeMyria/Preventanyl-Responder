import React from 'react';
import { AsyncStorage } from 'react-native';

// Wrapper for AsyncStorage, for more information check https://facebook.github.io/react-native/docs/asyncstorage.html

export default class Storage {

    static errorMessages = Object.freeze (
        {
            "GET_DATA_FAILURE"   : "Failed to retrieve data" ,
        }
    );

    static keys = Object.freeze (
        {
            "DISCLAIMER" : "DISCLAIMER"
        }
    )

    static values = Object.freeze (
        {
            "DISCLAIMER" : {
                "VALID" : {
                    "ACCEPTED" : "ACCEPTED"
                }
            }
        }
    )

    static async genericStoreData (key, data, successCallback, failureCallback) {
        await AsyncStorage.setItem (key, data).then ( (value) => 
            {
                successCallback ();
            }
        ).catch ( (error) => 
            {
                // Error saving data
                failureCallback (error);
            }
        )
    }

    static async genericGetData (key, successCallback, failureCallback) {
        await AsyncStorage.getItem (key).then ( (value) => 
            {
                if (value !== null)
                    // We have data!!
                    successCallback (value);
                else
                    throw new Error (Storage.errorMessages.GET_DATA_FAILURE);
            }
        ).catch ( (error) => 
            {
                // Error retrieving data
                failureCallback (error);
            }
        );
    }

    static getDisclaimerData (successCallback, failureCallback) {
        Storage.genericGetData (Storage.keys.DISCLAIMER, successCallback, failureCallback);
    }
    
    static setDisclaimerData (data, successCallback, failureCallback) {
        Storage.genericStoreData (Storage.keys.DISCLAIMER, data, successCallback, failureCallback);
    }

}