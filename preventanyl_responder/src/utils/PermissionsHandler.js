import Permissions from 'react-native-permissions'
import LocationHelper from '../utils/location';

export default class PermissionsHandler {

    permissionTypes = Object.freeze ({
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

    permissionStates = Object.freeze ({
        "AUTHORIZED"   : "authorized",
        "DENIED"       : "denied",
        "RESTRICTED"   : "restricted",
        "UNDETERMINED" : "'undetermined'"
    })

    errorMessages = Object.freeze ({
        "LOCATION_DENIED" : 'You cannot access the entire features of the app without location' 
    })

    static genericCheckPermission (permission, successCallback, failureCallback) {
        Permissions.check (permission).then ( response => {
            if (response !== permissionStates.AUTHORIZED)
                failureCallback ()
            else
                successCallback ()
        })
    }

    static genericRequestPermission (permission, successCallback, failureCallback) {
        Permissions.request (permission).then ( response => {
            if (response !== permissionStates.AUTHORIZED)
                failureCallback ()
            else
                successCallback ()
        })
    }

    static async requestLocationPermission (successCallback, failureCallback) {
        genericRequestPermission (permissionTypes.LOCATION, () => {
                LocationHelper.locationEnabled = true;
                successCallback ();
            }, () => {
                LocationHelper.locationEnabled = false;
                failureCallback (errorMessages.LOCATION_DENIED)
        });
    }

    // REMOVE CODE FROM PUSHNOTIFICATIONS FILE AND ADD TO HERE
    static requestPushNotificationPermission (successCallback, failureCallback) {
        genericRequestPermission (permissionTypes.PUSH_NOTIFICATION, () => {
                successCallback ();
            }, () => {
                failureCallback (errorMessages.LOCATION_DENIED)
        });
    }
    
}