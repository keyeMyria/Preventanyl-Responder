import { Constants, Location } from 'expo';

import ExpoPermissionsHandler from './ExpoPermissionsHandler';

export default class LocationHelper {
    static locationEnabled = false;
}

export const getCurrentLocation = (successCallback, failureCallback) => {

    if (LocationHelper.locationEnabled)
        return new Promise ((resolve, reject) => {
            navigator.geolocation.getCurrentPosition (position => resolve(position), e => reject(e));
        }).then (result => {
            successCallback (result);
        }).catch (error => {
            failureCallback (error);
        });
    else {
        return new Promise ((resolve, reject) => {
            throw new Error (ExpoPermissionsHandler.errorMessages.LOCATION_DENIED)
        }).then (result => {
            successCallback (result);
        }).catch (error => {
            failureCallback (error);
        });
    }
};

export const getCurrentLocationAsync = async (successCallback, failureCallback) => {

    ExpoPermissionsHandler.requestLocationPermission ( async () => {

        let location = await Location.getCurrentPositionAsync ( { } );
        successCallback (location)

    }, failureCallback)

};

export const setupLocation = async (successCallback, failureCallback) => {
    await getCurrentLocationAsync (async () => {
        getCurrentLocation (successCallback, failureCallback);
    }, failureCallback);
}

export const convertLocationToLatitudeLongitude = (location) => {
    /*  Object {
            "coords": Object {
                "accuracy": 65,
                "altitude": 109.47386169433594,
                "altitudeAccuracy": 10,
                "heading": -1,
                "latitude": 49.22724996030237,
                "longitude": -122.92167081498236,
                "speed": -1,
            },
            "timestamp": 1519656714765.542,
        } */

    return {
        latlng : {
            latitude  : location.coords.latitude,
            longitude : location.coords.longitude,
        },
        error : null,
    }
}