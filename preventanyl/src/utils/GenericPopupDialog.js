import React, { Component } from 'react';
import { AppRegistry, Platform, Text, View } from 'react-native';

import PopupDialog, { DialogTitle, DialogButton } from 'react-native-popup-dialog';

const DIALOG_HEIGHT = 0.3;
const DIALOG_WIDTH  = 0.75;
const DIALOG_LEFT_BUTTON_TEXT = "CANCEL";
const DISMISS_TOUCH_OUTSIDE = false;

export default class GenericPopupDialog extends Component {

    constructor (props) {
        super (props);
    }

    show () {
        this.popupDialog.show ();
    }

    dismiss () {
        this.popupDialog.dismiss ();
    }

    render () {

        if (Platform.OS === 'ios') {
            return (
                /* Implement iOS UI Style */
                <PopupDialog
                    dialogTitle = { <DialogTitle title = { this.props.title } /> }
                    ref = { (popupDialog) => { this.popupDialog = popupDialog; }} 
                    width = { DIALOG_WIDTH }
                    height = { DIALOG_HEIGHT }
                    dismissOnTouchOutside = { DISMISS_TOUCH_OUTSIDE }
                    actions = { [
                        <DialogButton key = { 1 } text = { DIALOG_LEFT_BUTTON_TEXT } align = "left" onPress = { () => {
                                if (this.props.cancelFunction)
                                    this.props.cancelFunction ()
                                    
                                this.popupDialog.dismiss() 
                            }
                        } />,
                        <DialogButton key = { 2 } text = { this.props.actionButtonText } align = "right" onPress = { () => this.props.actionFunction () } />,
                        ] } >
                    <View>
                        <Text>{ this.props.message }</Text>
                    </View>
                </PopupDialog>
            );
        }

        return (
            /* Implement Android UI Style */
            <PopupDialog
                dialogTitle = { <DialogTitle title = { this.props.title } /> }
                ref = { (popupDialog) => { this.popupDialog = popupDialog; }} 
                width = { DIALOG_WIDTH }
                height = { DIALOG_HEIGHT }
                dismissOnTouchOutside = { DISMISS_TOUCH_OUTSIDE }
                actions = { [
                    <DialogButton key = { 1 } text = { DIALOG_LEFT_BUTTON_TEXT } align = "left" onPress = { () => this.popupDialog.dismiss() } />,
                    <DialogButton key = { 2 } text = { this.props.actionButtonText } align = "right" onPress = { () => this.props.actionFunction () } />,
                    ] } >
                <View>
                    <Text>{ this.props.message }</Text>
                </View>
            </PopupDialog>
        );
    
    }

}

AppRegistry.registerComponent ('GenericPopupDialog', () => GenericPopupDialog);