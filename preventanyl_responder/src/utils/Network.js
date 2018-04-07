import React from 'react';

import { NetInfo } from 'react-native';

import { genericErrorMessageAlert } from './genericAlerts';

// Wrapper for NetInfo, for more details visit https://facebook.github.io/react-native/docs/netinfo.html

export default class Network {

    static connectionObject = {
        connected : false,
        type      : "unkown"
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

        Network.connectionObject = {
            connected : connected,
            type      : type
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
                Network.setConnectionObject (false, Network.errorMessages.NONE)
                genericErrorMessageAlert (new Error (Network.errorMessages.NO_INTERNET_CONNECTION));
            }, (error) => 
            {
                Network.setConnectionObject (false, Network.errorMessages.NONE)
            }
        );

    }

    static setupNetworkConnection () {
        Network.genericRemoveAllListeners (Network.eventTypes.CONNECTION_CHANGE);
        Network.genericAddListenerNetInfo (Network.eventTypes.CONNECTION_CHANGE, Network.changeNetworkStatus);
    }

}