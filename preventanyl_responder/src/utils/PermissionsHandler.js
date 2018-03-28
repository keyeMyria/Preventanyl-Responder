import Permissions from 'react-native-permissions'
import LocationHelper from './location';

export default class PermissionsHandler {

    static permissionTypes = Object.freeze ({
        "LOCATION"           : "location",
        "CAMERA"             : "camera",
        "MICROPHONE"         : "microphone",
    	"PHOTO"              : "photo",
    	"CONTACTS"           : "contacts",
    	"EVENT"              : "event",
    	"BLUETOOTH"          : "bluetooth",
    	"REMINDER"           : "reminder",
    	"PUSH_NOTIFICATION"  : "notification",
    	"BACKGROUND_REFRESH" : "backgroundRefresh",
    	"SPEECH_REGONITION"  : "speechRecognition",
        "MEDIA_LIBRARY"      : "mediaLibrary",
    	"MOTION"             : "motion",
        "STORAGE"            : "storage",
    	"PHONE_CALL"         : "callPhone",
    	"READ_SMS"           : "readSms",
    	"RECEIVE_SMS"        : "receiveSms"

    })

    static permissionStates = Object.freeze ({
        "AUTHORIZED"   : "authorized",
        "DENIED"       : "denied",
        "RESTRICTED"   : "restricted",
        "UNDETERMINED" : "'undetermined'"
    })

    static errorMessages = Object.freeze ({
        "LOCATION_DENIED"     : 'You cannot access the entire features of the app without location' ,
        'NOTIFICATION_DENIED' : 'You cannot help anybody that well without notifications :('
    })

    static iosFlags = Object.freeze ({
        "LOCATION"           : { 
            type: 'always' 
        },
        "CAMERA"             : {},
        "MICROPHONE"         : {},
    	"PHOTO"              : {},
    	"CONTACTS"           : {},
    	"EVENT"              : {},
    	"BLUETOOTH"          : {},
    	"REMINDER"           : {},
    	"PUSH_NOTIFICATION"  : {
            type: ['alert', 'badge']
        },
    	"BACKGROUND_REFRESH" : {},
    	"SPEECH_REGONITION"  : {},
        "MEDIA_LIBRARY"      : {},
    	"MOTION"             : {},
        "STORAGE"            : {},
    	"PHONE_CALL"         : {},
    	"READ_SMS"           : {},
    	"RECEIVE_SMS"        : {}
    })

    static genericCheckPermission (permission, type, successCallback, failureCallback) {
        Permissions.check (permission, type).then ( response => {
            if (response !== PermissionsHandler.permissionStates.AUTHORIZED)
                failureCallback ()
            else
                successCallback ()
        })
    }

    static genericRequestPermission (permission, type, successCallback, failureCallback) {
        console.log ('permission', permission);
        Permissions.request (permission, { type: 'always' }).then ( response => {
            if (response !== PermissionsHandler.permissionStates.AUTHORIZED)
                failureCallback ()
            else
                successCallback ()
        }).catch (error => {
            console.warn ('error : ', error);
        })
    }

    static async requestLocationPermission (successCallback, failureCallback) {

        console.log ("*requesting location*")

        PermissionsHandler.genericRequestPermission (PermissionsHandler.permissionTypes.LOCATION, PermissionsHandler.iosFlags.LOCATION, () => {
                LocationHelper.locationEnabled = true;
                successCallback ();
            }, () => {
                console.log ("SET TO FALSE");
                LocationHelper.locationEnabled = false;
                failureCallback (PermissionsHandler.errorMessages.LOCATION_DENIED)
        });
    }

    // REMOVE CODE FROM PUSHNOTIFICATIONS FILE AND ADD TO HERE
    static requestPushNotificationPermission (successCallback, failureCallback) {
        PermissionsHandler.genericRequestPermission (PermissionsHandler.permissionTypes.PUSH_NOTIFICATION, PermissionsHandler.iosFlags.PUSH_NOTIFICATION, () => {
                successCallback ();
            }, () => {
                failureCallback (PermissionsHandler.errorMessages.NOTIFICATIONS_DENIED)
        });
    }
    
}