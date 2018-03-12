import React from 'react';
import { StackNavigator } from 'react-navigation';

import LoginComponent from '../../components/LoginComponent/LoginComponent';

const StackNavigation = StackNavigator ({
        Login : {
            screen : LoginComponent,
            navigationOptions : {
                header : null
            }
        },
    },
    {
        initialRouteName : "Login"
    }
);

export default StackNavigation;