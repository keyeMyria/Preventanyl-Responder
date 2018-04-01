import { Linking } from 'react-native';

export const generateAppleMapsUrl = (source, dest) => {
    return `http://maps.apple.com/?saddr=${ source.latitude },${ source.longitude }&daddr=${ dest.latitude },${ dest.longitude }`
}

export const openMaps = (url) => {

    Linking.canOpenURL (url).then ( (supported) => {
        if (!supported)
            genericErrorAlert ("You must have apple maps installed to use this")
        else {
            return Linking.openURL (url).then ( (data) => {
                console.log (data);
            }).catch ( (error) => {
                console.log (error)
                genericErrorAlert ("You must have apple maps installed to use this")
            })
        }
    }).catch ( (error) => {
        console.log (error);
        genericErrorAlert ("Unable to give directions")
    })
    
}