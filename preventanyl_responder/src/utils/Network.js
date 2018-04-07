import React from 'react';

import { NetInfo } from 'react-native';

import { genericErrorMessageAlert } from './genericAlerts';
import { compareDiffHoursNow, getMomentNow, getMomentNowSubtractHours } from './localTimeHelper';

// Wrapper for NetInfo, for more details visit https://facebook.github.io/react-native/docs/netinfo.html

// 5 seconds in hours
const ALERT_NO_CONNECTION_COOLDOWN = 0.00138889;

export default class Network {

    static connectionObject = {
        connected : false,
        type      : "unkown",
        timestamp : getMomentNowSubtractHours (2)
    }

    static ConnectionTypes = Object.freeze (
        {
            "NONE"     : "none",
            "WIFI"     : "wifi",
            "CELLULAR" : "cellular",
            "UNKNOWN"  : "unknown"
        }
    );

    static eventTypes = Object.freeze (
        {
            "CONNECTION_CHANGE" : "connectionChange"
        }
    );

    static listenerFunctions = {
        "connectionChange" : []
    };

    static errorMessages = Object.freeze (
        {
            "NO_INTERNET_CONNECTION"   : 'There is no internet connection available\nThis app may not function as intended without network connection' ,
        }
    );
    
    static genericGetConnectionStatus (successCallback, failureCallback) {
        NetInfo.getConnectionInfo ().then ( (connectionInfo) => 
            {
                console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
                successCallback (connectionInfo)
            }
        ).catch ( (error) => 
            {
                failureCallback (error);
            }
        );
    }

    static genericAddListenerNetInfo (eventName, handler) {
        NetInfo.isConnected.addEventListener(eventName, handler);
        Network.listenerFunctions[eventName].push (handler);
    }

    static genericRemoveListenerNetInfo (eventName, handler) {
        NetInfo.isConnected.removeEventListener (eventName, handler);
        Network.listenerFunctions[eventName] = Network.listenerFunctions[eventName].filter ( (func) => 
            {
                return func !== handler
            }
        );
    }

    static genericRemoveAllListeners (eventName) {
        Network.listenerFunctions[eventName].map ( (func) => 
            {
                NetInfo.isConnected.removeEventListener(eventName, func);
            }
        )
        
        Network.listenerFunctions[eventName] = [];
    }

    static checkNetworkConnection (successMobileCallback, successWifiCallback, noInternetConnectionCallback, failureCallback) {
        Network.genericGetConnectionStatus ( (connectionInfo) => 
            {
                if (connectionInfo.type === Network.ConnectionTypes.NONE)
                    noInternetConnectionCallback (new Error (Network.errorMessages.NO_INTERNET_CONNECTION))

                else if (connectionInfo.type === Network.ConnectionTypes.UNKNOWN)
                    failureCallback (new Error (Network.errorMessages.NO_INTERNET_CONNECTION))

                // can use EffectiveConnectionType Enum to extrapolate more information such as 2g, 3g, 4g, unknown
                else if (connectionInfo.type === Network.ConnectionTypes.CELLULAR)
                    successMobileCallback (connectionInfo)
                
                else if (connectionInfo.type === Network.ConnectionTypes.WIFI)
                    successWifiCallback (connectionInfo)
            }
        ,(error) => 
            {
                console.log (error);
                failureCallback (error);
            }
        )
    }

    static setConnectionObject (connected, type) {

        timestamp = (type === Network.ConnectionTypes.NONE) ? getMomentNow () : Network.connectionObject.timestamp;

        Network.connectionObject = {
            connected : connected,
            type      : type,
            timestamp : timestamp
        }

    }
 
    static changeNetworkStatus () {

        Network.checkNetworkConnection ( (connectionInfo) => 
            {
                Network.setConnectionObject (true, connectionInfo.type)
            }, (connectionInfo) => 
            {
                Network.setConnectionObject (true, connectionInfo.type)
            }, (error) => 
            {
                let previousConnectionObject = Network.connectionObject;

                Network.setConnectionObject (false, Network.ConnectionTypes.NONE)
               
                if (compareDiffHoursNow (previousConnectionObject.timestamp) > ALERT_NO_CONNECTION_COOLDOWN)
                    genericErrorMessageAlert (new Error (Network.errorMessages.NO_INTERNET_CONNECTION));
                    
            }, (error) => 
            {
                Network.setConnectionObject (false, Network.ConnectionTypes.NONE)
            }
        );

    }

    // Add listener, handler calls network connection again to get latest update.
    static setupNetworkConnection () {
        Network.genericRemoveAllListeners (Network.eventTypes.CONNECTION_CHANGE);
        Network.genericAddListenerNetInfo (Network.eventTypes.CONNECTION_CHANGE, Network.changeNetworkStatus);
    }

}