import React, { Component } from 'react';
import { View, Text, NetInfo } from 'react-native';

import MessageBox from './MessageBox';
import config from '../../config/config';
import Localize from './../../config/i18n/Localize';

class NoInternetModal extends Component {
    
    constructor () {
        super();
        this.state = {
            noInternet: false
        };
    }

    componentDidMount () {
        NetInfo.addEventListener('connectionChange', (connectionInfo) => {
            console.log('Connection ==>>>>>>>>>>', connectionInfo);
            if (connectionInfo.type && connectionInfo.type === 'none') {
                console.log('Device is offline');
                this.setState({ noInternet: true });
            }
            else {
                this.setState({ noInternet: false });
            }
        });
        this.checkInternetConnectionExplicit();
    }

    checkInternetConnectionExplicit () {
        NetInfo.getConnectionInfo()
        .then(connectionInfo => {
            console.log('Net Info Explicit =>>>>>>>', connectionInfo);
            if (connectionInfo.type && connectionInfo.type === 'none') {
                this.setState({ noInternet: true });
            }
            else {
                this.setState({ noInternet: false });
            }
        });
    }

    render () {
        return (
            <MessageBox 
                source="No Internet Modal"
                visible = { this.state.noInternet }
                hasOverlayBackground = { true }
                type='noInternet'
                buttonText={ Localize.t('COMMON.try_again') }
                title={ Localize.t('COMMON.no_internet_connection') }
                description={ Localize.t('COMMON.no_internet_message') }
                // buttonText="Try Again"
                // title="No Internet Connection"
                // description="Make sure you're connected to a Wi-Fi or mobile network and try again."
                titleStyle={ { color: config.UI.redBalance } }
                handler={ () => { this.checkInternetConnectionExplicit() } }
            />
        );
    }
}

export default NoInternetModal;