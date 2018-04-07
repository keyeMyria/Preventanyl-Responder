import React from 'react';

import { removeAllWhitespace } from './strings';
import { validateCallback } from '@firebase/util';

export default class Validation {

    static VALIDATION_REGEX = Object.freeze (
        {
            "EMAIL" :  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
    )

    static validateEmail = (email) => {
        return (Validation.validateString (email) && Validation.VALIDATION_REGEX.EMAIL.test ( String(email).toLowerCase() ));
    }

    static validateString = (value) => {
        return (value !== undefined && removeAllWhitespace (value) !== "")
    }

}