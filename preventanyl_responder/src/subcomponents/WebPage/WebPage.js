import React, { Component } from 'react';
import { AppRegistry, WebView } from 'react-native';

import { openWebPage } from '../../utils/linkingUrls';

export default class WebPage extends Component {

    constructor (props) {
        super (props);
    }

    render () {

        const uri =  this.props.url;

        return (
            <WebView
                ref = { (ref) => 
                    { 
                        this.webview = ref; 
                    }
                }

                source = { 
                    {
                        uri
                    }
                }

                onNavigationStateChange = { (event) => 
                    {
                        if (event.url !== uri) {
                            this.webview.stopLoading ();
                            openWebPage (event.url);
                        }
                    }
                } />
        );
    }

}

AppRegistry.registerComponent ('WebPage', () => WebPage);