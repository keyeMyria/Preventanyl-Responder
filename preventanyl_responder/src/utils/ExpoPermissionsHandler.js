import { Permissions } from 'expo'

import LocationHelper from './location';
import { genericErrorAlert } from './genericAlerts';

export default class ExpoPermissionsHandler {

    static permissionStates = Object.freeze ({
        "GRANTED"   : "granted",
    })

    static errorMessages = Object.freeze ({
        "LOCATION_DENIED"          : 'You cannot access the entire features of the app without location' ,
        'NOTIFICATIONS_DENIED'     : 'You cannot help anybody that well without notifications :(',
        'GENERIC_PERMISSION_ERROR' : 'Permission not granted'
    })

    static async genericCheckPermission (permission, errorMessage, successCallback, failureCallback) {
        const { status } = await Permissions.getAsync (permission)
        
        if (status !== ExpoPermissionsHandler.permissionStates.GRANTED) {
            failureCallback   (new Error (errorMessage ? errorMessage : ExpoPermissionsHandler.errorMessages.GENERIC_PERMISSION_ERROR));
            genericErrorAlert (errorMessage ? errorMessage : ExpoPermissionsHandler.errorMessages.GENERIC_PERMISSION_ERROR)
        } else
            successCallback ();
    }

    static async genericRequestPermission (permission, errorMessage, successCallback, failureCallback) {
        const { status } = await Permissions.askAsync (permission);

        if (status === ExpoPermissionsHandler.permissionStates.GRANTED)
            successCallback ();
        else {
            failureCallback (new Error (errorMessage ? errorMessage : ExpoPermissionsHandler.errorMessages.GENERIC_PERMISSION_ERROR));
            genericErrorAlert (errorMessage ? errorMessage : ExpoPermissionsHandler.errorMessages.GENERIC_PERMISSION_ERROR)
        }
    }

    static async requestLocationPermission (successCallback, failureCallback) {
        ExpoPermissionsHandler.genericRequestPermission (Permissions.LOCATION, ExpoPermissionsHandler.errorMessages.LOCATION_DENIED, () => {
                LocationHelper.locationEnabled = true;
                successCallback ();
            }, () => {
                LocationHelper.locationEnabled = false;
                failureCallback (ExpoPermissionsHandler.errorMessages.LOCATION_DENIED)
        });
    }

    // REMOVE CODE FROM PUSHNOTIFICATIONS FILE AND ADD TO HERE
    static requestPushNotificationPermission (successCallback, failureCallback) {
        ExpoPermissionsHandler.genericRequestPermission (Permissions.NOTIFICATIONS, ExpoPermissionsHandler.errorMessages.NOTIFICATIONS_DENIED, () => {
                successCallback ();
            }, () => {
                failureCallback (ExpoPermissionsHandler.errorMessages.NOTIFICATIONS_DENIED)
            }
        );
    }
    
}