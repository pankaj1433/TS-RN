import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import Store from './../store/index';
import Localize from '../config/i18n/Localize';
import { ifIphoneX } from '../utils/iPhoneXHelper';


class AlertBox extends Component {

    constructor () {
        super();
        this.ref;
    }

    onAlertClose = () => {
        this.props.alertClose();
    };

    componentWillMount () {
        // Store.subscribe(() => {
        //     let alert = Store.getState()['alert']
        //     let showAlert = alert.showAlert;
        //     let alertType = 'error';
        //     let alertTitle = '';
        //     let message = Localize.t('COMMON.generic_error');
        //     if (showAlert === true) {
        //         if ( alert.alertMessage !== '' ) {
        //             message = alert.alertMessage || message;
        //             alertType = alert.alertType || 'error';
        //             alertTitle = alert.alertTitle || '';
        //         }
        //         this.ref && this.ref.alertWithType(alertType, alertTitle, message);
        //         setTimeout(() => {
        //             this.onAlertClose();
        //         }, 4500);
        //     }
        // });
    }

    componentWillReceiveProps (nextProps) {
        let showAlert = nextProps.alert.showAlert;
        let alertType = 'error';
        let alertTitle = '';
        let message = Localize.t('COMMON.generic_error');
        // let message = "Oops! Something went wrong. Please Try Again";
        if (showAlert === true) {
            if ( nextProps.alert.alertMessage !== '' ) {
                message = nextProps.alert.alertMessage || message;
                alertType = nextProps.alert.alertType || 'error';
                alertTitle = nextProps.alert.alertTitle || '';
            }
            this.ref && this.ref.alertWithType(alertType, alertTitle, message);
            setTimeout(() => {
                this.onAlertClose();
            }, 4500);
        }
    }

    render() {
        
        return (
            <View style = {styles.container}>
                <DropdownAlert 
                    errorColor='#d73d4e' 
                    elevation = {5}
                    // defaultContainer={{padding: 10,flexDirection: 'row',justifyContent:'center',alignItems: 'center'}}
                    // defaultTextContainer = {{ padding: 8,alignItems:'center' }}
                    closeInterval = {4500}
                    // imageStyle = {{height:20,width:20}}
                    zIndex = { 100 }
                    onClose = { () => { this.onAlertClose } }
                    ref={ (ref) => { this.ref = ref } } />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            // ios: {
            //     position: 'absolute',
            //     top: 0,
            //     left: 0,
            //     right: 0,
            //     zIndex: 100,
            // },
            ios: {
                ...ifIphoneX({
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                }, {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                })
            },
            android: {
                top :Constants.statusBarHeight
            }
        })
    }
})

const mapStateToProps = (state) => ({
    alert: state.alert
});

const mapDispatchToProps = (dispatch) => ({
    alertClose: () => dispatch({ type: 'HIDE_ALERT', showAlert: false, alertMessage: '' })
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertBox);