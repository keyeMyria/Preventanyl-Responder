export const getCurrentLocation = (successCallback, failureCallback) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    }).then (result => {
        successCallback (result);
    }).catch (error => {
        failureCallback (error);
    });
};

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