import { Alert } from 'react-native';

import Database from '../database/Database';

import LogoutComponent from '../components/LogoutComponent/LogoutComponent';

const CONFIRMATION_TITLE    = "Confirmation required";
const LOGOUT_PROMPT_MESSAGE = "Do you really want to logout?";
const OVERDOSE_DIRECTIONS   = "Directions";
const ERROR_TITLE           = "Whoops!";
const REQUIRED_FIELD_TITLE  = "Required Field";
const RESEND_EMAIL          = "Resend email";
const DEFAULT_TITLE         = "TITLE";
const DEFAULT_MESSAGE       = "MESSAGE";
const UNDISSMISSABLE        = "Undissmissable";
const OKAY                  = "Okay";
const ACCEPT                = "Accept";
const CANCEL                = "Cancel";

export const GENERIC_ALERT_OBJECTS = Object.freeze (
    {
        OKAY : {
            text    : OKAY,
            onPress : () => {}
        },
        CANCEL : {
            text    : CANCEL,
            onPress : () => {}
        },
        UNDISSMISSABLE : {
            cancelable : false,
            onDismiss  : () => {}
        },
        RESEND_EMAIL : {
            text : RESEND_EMAIL, 
            onPress : () => {
                Database.sendVerificationEmail ();
            }
        },
    }
)

export const genericAlert = (title, message) => {

    if (title === "" || message === "")
        return;

    Alert.alert (
        title,
        message, 
        [
            GENERIC_ALERT_OBJECTS.OKAY
        ],  
        
    )   

}

export const genericConfirmationAlert = (message, func) => {
    if (message === "")
        return;

    Alert.alert (
        CONFIRMATION_TITLE,
        message,
        [
            GENERIC_ALERT_OBJECTS.CANCEL,
            {
                text : ACCEPT,
                onPress : () => {
                    func ();
                }
            }
        ],
    );
}

export const genericErrorAlert = (message) => {
    genericAlert(ERROR_TITLE, message);
}

export const genericErrorMessageAlert = (error) => {
    genericAlert(ERROR_TITLE, error.message);
}

export const genericErrorDescriptionAlert = (error) => {
    if (error === undefined || error === undefined || typeof error === "string")
        return;

    genericAlert(ERROR_TITLE, error.response.data.error_description);
}

export const genericRequiredFieldAlert = (field) => {
    genericAlert (REQUIRED_FIELD_TITLE, `Please enter a ${ field }`);
}

export const genericNotFormattedFieldAlert = (field) => {
    genericAlert (REQUIRED_FIELD_TITLE, `${ field } is not formatted properly`);
}

export const genericVerificationAlert = (title, message) => {
    if (title === "" || message === "")
        return;

    if (!Database.checkUserVerfied ()) {
        Alert.alert (
            title,
            message,
            [
                GENERIC_ALERT_OBJECTS.RESEND_EMAIL,
                GENERIC_ALERT_OBJECTS.OKAY
            ],
            GENERIC_ALERT_OBJECTS.UNDISSMISSABLE
        );
    }
}

export const genericDefaultAlert = () => {
    genericAlert (DEFAULT_TITLE, DEFAULT_MESSAGE)
}

export const overdoseNotificationAlert = (title, message, func) => {
    if (title === "" || message === "")
        return;
    
    Alert.alert (
        title,
        message,
        [
            {
                text    : OVERDOSE_DIRECTIONS, 
                onPress : () => {
                    func ();
                }
            },
            GENERIC_ALERT_OBJECTS.OKAY
        ]
    );
}

export const logoutConfirmationAlert = () => {
    genericConfirmationAlert (LOGOUT_PROMPT_MESSAGE, () => 
        {
            LogoutComponent.logoutUser ();
        }
    )
}