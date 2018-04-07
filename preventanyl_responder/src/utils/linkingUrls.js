import { Linking } from 'react-native';

import { genericErrorAlert } from './genericAlerts';

export const displayErrors = Object.freeze (
    {
        "APPLE_MAPS" : {
            functionalityRequiredErrorMessage : "You must have apple maps installed to use this",
            errorMessage                      : "Unable to give directions"
        },
        "WEB_PAGE" : {
            functionalityRequiredErrorMessage : "You must have a browser installed to use this",
            errorMessage                      : "Unable to open link"
        }
    }
)

export const generateAppleMapsUrl = (source, dest) => {
    return `http://maps.apple.com/?saddr=${ source.latitude },${ source.longitude }&daddr=${ dest.latitude },${ dest.longitude }`
}

export const genericOpenUrl = (url, displayError) => {

    Linking.canOpenURL (url).then ( (supported) => 
        {
            if (!supported)
                genericErrorAlert (displayError.functionalityRequiredErrorMessage)
            else {
                return Linking.openURL (url).then ( (data) => 
                    {
                        console.log (data);
                    }
                ).catch ( (error) => 
                    {
                        console.log (error)
                        genericErrorAlert (displayError.functionalityRequiredErrorMessage)
                    }
                )
            }
        }
    ).catch ( (error) => 
        {
            console.log (error);
            genericErrorAlert (displayError.errorMessage)
        }
    )

}

export const openMaps = (url) => {

    genericOpenUrl (url, displayErrors.APPLE_MAPS)
    
}

export const openWebPage = (url) => {
    
    genericOpenUrl (url, displayErrors.WEB_PAGE);

}